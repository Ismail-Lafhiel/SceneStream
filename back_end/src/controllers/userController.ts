import { Request, Response } from 'express';
import { getUsersData } from '../services/userService';
import { AppError } from '../utils/errors';

/**
 * Fetch users from MongoDB (only accessible by ADMIN group).
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Fetch users from MongoDB
    const users = await getUsersData();
    res.json(users);
  } catch (error) {
    throw new AppError(500, 'Failed to fetch users data');
  }
};