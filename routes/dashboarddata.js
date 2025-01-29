import express from 'express';
import { getALLSells,getItemsSoldToday,mapSoldItems,confirmSale,Reportitem,getTotalCashAmount,getTodaySells,getAllitemsSold,getTodayProfit,Perm} from '../controllers/dashboarddata.js';
import { checkAuth } from '../middleware/checkAuth.js';


const router=express.Router();
//const db = query()

router.get('/sales',checkAuth,getALLSells);
router.get('/items',checkAuth,getAllitemsSold);
router.get('/todayitems',checkAuth,getItemsSoldToday);
router.get('/sold',mapSoldItems);
router.post('/pay',checkAuth,confirmSale);
router.get('/reportitem',checkAuth,Reportitem);
router.get('/mpesa',checkAuth,getTotalCashAmount);
router.get('/todaycash',checkAuth,getTodaySells);
router.get('/todayprofit',checkAuth,getTodayProfit);
router.get('/permision',checkAuth,Perm);


export default router;

