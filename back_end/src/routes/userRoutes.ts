import express from "express";
import { getUsers } from "../controllers/userController";
import { protect, checkAdminGroup } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", protect, checkAdminGroup, getUsers);

export default router;
