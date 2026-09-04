import express from 'express'
import { findPeople } from '../routes/communities';

const router = express.Router()

router.get('/findPeople' , findPeople)

export default router