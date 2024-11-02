import express from "express";
import { getUser } from "../Controllers/users.js";

const router = express.Router();

router.get("/:id", getUser)

export default router;