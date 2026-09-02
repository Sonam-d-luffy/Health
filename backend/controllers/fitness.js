import { saveExercise } from "../routes/fitness.js";
import express from 'express'

const router = express.Router()

router.post("/save", saveExercise);

export default router