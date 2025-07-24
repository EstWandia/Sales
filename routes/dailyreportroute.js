import express from 'express';
import {getDailyReports } from '../controllers/dailyreportcontr.js'
import { checkAuth } from '../middleware/checkAuth.js';
import { checkPermission } from '../middleware/allowedUsers.js';



const router =express.Router();

router.get('/dailyreport',checkAuth,checkPermission,getDailyReports);

export default router