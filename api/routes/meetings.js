import express from "express";
import { getConfirmedMeetings, getPendingMeetings } from "../controllers/meetings.js";

const router = express.Router();

router.get("/:id", getConfirmedMeetings);
router.get("/pending/:id", getPendingMeetings);

export default router;