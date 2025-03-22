export interface IUser {
    _id: string;
    cognitoId: string;
    email: string;
    name: string;
    role: string;
    username?: string;
    status?: string;
    created?: Date;
    __v?: number;
  }