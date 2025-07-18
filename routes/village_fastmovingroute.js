import express from 'express';
import {getFastMoving } from '../controllers/village_fastmoving.js'
import { checkAuth } from '../middleware/checkAuth.js';



const router =express.Router();

router.get('/fast',checkAuth,getFastMoving);

export default router