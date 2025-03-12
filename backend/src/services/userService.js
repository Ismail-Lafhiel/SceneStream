const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminListGroupsForUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");
const config = require("../config/config");
const { ApiError } = require("../utils/errors");
const User = require("../models/user");

// Initialize the Cognito client
const client = new CognitoIdentityProviderClient({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

/**
 * Sync users from Cognito to MongoDB.
 */
exports.syncUsersFromCognito = async () => {
  try {
    const params = {
      UserPoolId: config.aws.userPoolId,
      Limit: 60, // Adjust the limit as needed
    };

    console.log("Fetching users from Cognito with params:", params);

    let users = [];
    let paginationToken = null;

    do {
      if (paginationToken) {
        params.PaginationToken = paginationToken;
      }

      // Fetch users from Cognito
      const command = new ListUsersCommand(params);
      const result = await client.send(command);

      // Process users and ensure they're in our database
      for (const cognitoUser of result.Users) {
        const attributes = {};
        cognitoUser.Attributes.forEach((attr) => {
          attributes[attr.Name] = attr.Value;
        });

        const userData = {
          cognitoId: attributes.sub,
          email: attributes.email || "",
          name: attributes.name || "",
        };

        // Fetch the user's groups from Cognito
        const groupsParams = {
          UserPoolId: config.aws.userPoolId,
          Username: cognitoUser.Username,
        };
        const groupsCommand = new AdminListGroupsForUserCommand(groupsParams);
        const groupsResult = await client.send(groupsCommand);
        const groups = groupsResult.Groups.map((group) => group.GroupName);

        // Find or create user in our database
        let user = await User.findOne({ cognitoId: userData.cognitoId });

        if (!user) {
          user = new User({
            ...userData,
            role: groups.includes("ADMIN") ? "ADMIN" : "USER", // Set role based on groups
          });
          await user.save();
        } else if (
          user.email !== userData.email ||
          user.name !== userData.name ||
          user.role !== (groups.includes("ADMIN") ? "ADMIN" : "USER") // Update if role differs
        ) {
          user.email = userData.email;
          user.name = userData.name;
          user.role = groups.includes("ADMIN") ? "ADMIN" : "USER";
          await user.save();
        }

        // Add to our results with additional Cognito data
        users.push({
          ...user.toObject(),
          username: cognitoUser.Username,
          status: cognitoUser.UserStatus,
          created: cognitoUser.UserCreateDate,
        });
      }

      paginationToken = result.PaginationToken;
    } while (paginationToken);

    return users;
  } catch (error) {
    console.error("Cognito Error:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });
    throw new ApiError(500, "Failed to sync users from Cognito");
  }
};

/**
 * Fetch users from MongoDB.
 */
exports.getUsersData = async () => {
  try {
    // Fetch users from MongoDB
    const users = await User.find({});
    return users;
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw new ApiError(500, "Failed to fetch users data");
  }
};
