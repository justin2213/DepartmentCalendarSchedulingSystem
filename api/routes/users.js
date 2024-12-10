import express from "express";
import { getUser, getUsers, getAvailability } from "../controllers/users.js";

const router = express.Router();

router.get("/:id", getUser)
router.get("/", getUsers)
router.post("/availability", getAvailability)

export default router;