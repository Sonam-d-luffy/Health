import express from 'express'
import { getTerritories, getTerritory } from '../routes/territory.js';

const router = express.Router();

router.get('/champs' ,  getTerritories);
router.get('/:name/champ',getTerritory)

export default router