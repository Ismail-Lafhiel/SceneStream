import express from "express";
import { getUsers } from "../controllers/userController";
import { protect, checkAdminGroup } from "../middlewares/authMiddleware";

const router = express.Router();

// Fetch users data (only accessible by users in the ADMIN group)
router.get("/", protect, checkAdminGroup, getUsers);

export default router;
