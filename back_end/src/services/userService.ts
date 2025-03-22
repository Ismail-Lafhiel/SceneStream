import {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminListGroupsForUserCommand,
    ListUsersCommandInput,
    AttributeType,
    GroupType,
  } from '@aws-sdk/client-cognito-identity-provider';
  import config from '../config/config';
  import { AppError } from '../utils/errors';
  import User from '../models/user.model';
  import { IUser } from '../interfaces/user.interface';
  
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
  export const syncUsersFromCognito = async (): Promise<IUser[]> => {
    try {
      const params: ListUsersCommandInput = {
        UserPoolId: config.aws.userPoolId,
        Limit: 60, // Adjust the limit as needed
      };
  
      console.log('Fetching users from Cognito with params:', params);
  
      let users: IUser[] = [];
      let paginationToken: string | undefined = undefined;
  
      do {
        if (paginationToken) {
          params.PaginationToken = paginationToken;
        }
  
        // Fetch users from Cognito
        const command = new ListUsersCommand(params);
        const result = await client.send(command);
  
        // Process users and ensure they're in the database
        for (const cognitoUser of result.Users || []) {
          const attributes: Record<string, string> = {};
          cognitoUser.Attributes?.forEach((attr: AttributeType) => {
            if (attr.Name && attr.Value) {
              attributes[attr.Name] = attr.Value;
            }
          });
  
          const userData = {
            cognitoId: attributes.sub,
            email: attributes.email || '',
            name: attributes.name || '',
          };
  
          // Fetch the user's groups from Cognito
          const groupsParams = {
            UserPoolId: config.aws.userPoolId,
            Username: cognitoUser.Username,
          };
          const groupsCommand = new AdminListGroupsForUserCommand(groupsParams);
          const groupsResult = await client.send(groupsCommand);
          const groups = (groupsResult.Groups || []).map((group: GroupType) => group.GroupName);
  
          // Find or create user in the database
          let user = await User.findOne({ cognitoId: userData.cognitoId });
  
          if (!user) {
            user = new User({
              ...userData,
              role: groups.includes('ADMIN') ? 'ADMIN' : 'USER',
            });
            await user.save();
          } else if (
            user.email !== userData.email ||
            user.name !== userData.name ||
            user.role !== (groups.includes('ADMIN') ? 'ADMIN' : 'USER')
          ) {
            user.email = userData.email;
            user.name = userData.name;
            user.role = groups.includes('ADMIN') ? 'ADMIN' : 'USER';
            await user.save();
          }
  
          // Add to our results with additional Cognito data
          users.push({
            ...(user.toObject() as IUser), // Type assertion to IUser
            username: cognitoUser.Username || '',
            status: cognitoUser.UserStatus || '',
            created: cognitoUser.UserCreateDate || new Date(),
          });
        }
  
        paginationToken = result.PaginationToken;
      } while (paginationToken);
  
      return users;
    } catch (error) {
      console.error('Cognito Error:', {
        code: error instanceof Error ? error.message : 'Unknown error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });
      throw new AppError(500, 'Failed to sync users from Cognito');
    }
  };
  
  /**
   * Fetch users from MongoDB.
   */
  export const getUsersData = async (): Promise<IUser[]> => {
    try {
      // Fetch users from MongoDB
      const users = await User.find({});
      return users;
    } catch (error) {
      console.error('Error fetching users data:', error);
      throw new AppError(500, 'Failed to fetch users data');
    }
  };