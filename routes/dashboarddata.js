import express from 'express';
import { getALLSells,getItemsSoldToday,confirmSale,Reportitem,getTotalCashAmount} from '../controllers/dashboarddata.js';

const router=express.Router();
//const db = query()

router.get('/sales',getALLSells);
router.get('/items',getItemsSoldToday);
//router.get('/sold',mapSoldItems);
router.post('/pay',confirmSale);
router.get('/reportitem',Reportitem);
router.get('/mpesa',getTotalCashAmount);

export default router;

