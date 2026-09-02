import { getLeaderboard, getUserProfile, saveActivity } from "../routes/activity.js";
import express from 'express'
const router = express.Router()

router.get("/leaderboard", getLeaderboard);
router.post("/save", saveActivity);
router.get("/profile/:userId",getUserProfile)

export default router