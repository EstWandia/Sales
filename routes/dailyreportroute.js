import express from 'express';
import {getDailyReports } from '../controllers/dailyreportcontr.js'
import { checkAuth } from '../middleware/checkAuth.js';



const router =express.Router();

router.get('/dailyreport',checkAuth,getDailyReports);

export default router