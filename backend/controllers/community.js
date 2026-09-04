import express from 'express'
import { findPeople, userProfile } from '../routes/communities.js';

const router = express.Router()

router.get('/findPeople' , findPeople)
router.get('/:id/userProfile',userProfile)

export default router