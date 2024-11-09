import express from "express";
import { getEvents } from "../controllers/events.js";

const router = express.Router();

router.get('/:id', getEvents);

export default router;