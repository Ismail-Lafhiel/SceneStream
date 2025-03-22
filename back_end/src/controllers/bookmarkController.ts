import { Request, Response } from "express";
import { bookmarkService } from "../services/bookmarkService";
import catchAsync from "../utils/catchAsync";

//@ts-ignore
interface AuthenticatedRequest extends Request {
  user?: {
    id: string | number;
    [key: string]: any;
  };
}

export const bookmarkController = {
  /**
   * Create a new bookmark (movie or TV show)
   */
  createBookmark: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }

      const { type, ...data } = req.body;

      let bookmark;
      if (type === "movie") {
        bookmark = await bookmarkService.createMovieBookmark(String(userId), data);
      } else if (type === "tv") {
        bookmark = await bookmarkService.createTvShowBookmark(String(userId), data);
      } else {
        throw new Error("Invalid bookmark type. Must be 'movie' or 'tv'.");
      }

      res.status(201).json({
        status: "success",
        data: bookmark,
      });
    }
  ),

  /**
   * Delete a bookmark (movie or TV show)
   */
  deleteBookmark: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }

      const { type, id } = req.params;

      if (type === "movie") {
        await bookmarkService.deleteMovieBookmark(String(userId), parseInt(id));
      } else if (type === "tv") {
        await bookmarkService.deleteTvShowBookmark(String(userId), parseInt(id));
      } else {
        throw new Error("Invalid bookmark type. Must be 'movie' or 'tv'.");
      }

      res.status(200).json({
        status: "success",
        message: "Bookmark deleted successfully",
      });
    }
  ),

  /**
   * Get all bookmarks (movies and TV shows) for the authenticated user
   */
  getUserBookmarks: catchAsync(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User ID not found in request");
      }

      const bookmarks = await bookmarkService.getUserBookmarks(String(userId));

      res.status(200).json({
        status: "success",
        results: bookmarks.length,
        data: bookmarks,
      });
    }
  ),
};