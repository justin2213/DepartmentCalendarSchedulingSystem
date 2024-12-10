import express from "express";
import { getEvents, postMeeting } from "../controllers/events.js";

const router = express.Router();

router.get('/:id', getEvents);
router.post('/', postMeeting);


export default router;