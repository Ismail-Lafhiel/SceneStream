import { Request, Response } from "express";
import { statisticsService } from "../services/statisticsService";

// Get movie statistics
export const getMovieStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getMovieStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching movie statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get TV show statistics
export const getTVShowStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getTVShowStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching TV show statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get genre statistics
export const getGenreStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getGenreStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching genre statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user statistics
export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getUserStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all statistics
export const getAllStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await statisticsService.getAllStatistics();
    res.json(stats);
  } catch (error) {
    console.error("Error fetching all statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};