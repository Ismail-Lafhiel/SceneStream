const { CognitoIdentityServiceProvider } = require("aws-sdk");
const config = require("../config/config");
const { ApiError } = require("../utils/errors");
const User = require("../models/user");

const cognito = new CognitoIdentityServiceProvider({
  region: config.aws.region,
});

exports.getUserById = async (userId) => {
  try {
    // get user from our mongodb database
    let user = await User.findOne({ cognitoId: userId });
    let cognitoUser;

    // Get user from Cognito
    const params = {
      UserPoolId: config.aws.userPoolId,
      Filter: `sub = "${userId}"`,
    };

    const result = await cognito.listUsers(params).promise();

    if (result.Users && result.Users.length > 0) {
      const cognitoUserData = result.Users[0];

      // Transforming Cognito user attributes to a usable format
      const attributes = {};
      cognitoUserData.Attributes.forEach((attr) => {
        attributes[attr.Name] = attr.Value;
      });

      cognitoUser = {
        cognitoId: attributes.sub,
        email: attributes.email || "",
        name: attributes.name || "",
        username: cognitoUserData.Username,
        status: cognitoUserData.UserStatus,
      };

      // If user doesn't exist in our mongoDB, create it
      if (!user) {
        user = new User({
          cognitoId: cognitoUser.cognitoId,
          email: cognitoUser.email,
          name: cognitoUser.name,
        });
        await user.save();
      }
      // If user exists but data is different, update it
      else if (
        user.email !== cognitoUser.email ||
        user.name !== cognitoUser.name
      ) {
        user.email = cognitoUser.email;
        user.name = cognitoUser.name;
        await user.save();
      }

      // Return a merged object with data from both sources
      return {
        ...user.toObject(),
        username: cognitoUser.username,
        status: cognitoUser.status,
      };
    }

    // If user exists in our mongoDB but not in Cognito (unusual case)
    if (user) {
      return user;
    }

    throw new ApiError(404, "User not found");
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new ApiError(500, "Failed to fetch user");
  }
};

exports.getAllUsers = async () => {
  try {
    const params = {
      UserPoolId: config.aws.userPoolId,
      Limit: 60,
    };

    let users = [];
    let paginationToken = null;

    do {
      if (paginationToken) {
        params.PaginationToken = paginationToken;
      }

      const result = await cognito.listUsers(params).promise();

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

        // Find or create user in our database
        let user = await User.findOne({ cognitoId: userData.cognitoId });

        if (!user) {
          user = new User(userData);
          await user.save();
        } else if (
          user.email !== userData.email ||
          user.name !== userData.name
        ) {
          // Update if data differs
          user.email = userData.email;
          user.name = userData.name;
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
    console.error("Error listing users:", error);
    throw new ApiError(500, "Failed to list users");
  }
};
