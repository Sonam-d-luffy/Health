import { getInstituteProfile } from "../routes/institute.js";
import express from 'express'

const router = express.Router()
router.get("/profile/:id", getInstituteProfile);

export default router;