import express from 'express'
import { getNearbySports } from '../routes/sports.js';

const router = express.Router()

router.get('/nearby',getNearbySports)

export default router