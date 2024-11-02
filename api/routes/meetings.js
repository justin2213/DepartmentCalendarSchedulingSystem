import express from "express";
import { getConfirmedMeetings, getPendingMeetings } from "../Controllers/meetings.js";

const router = express.Router();

router.get("/:id", getConfirmedMeetings);
router.get("/pending/:id", getPendingMeetings);

export default router;