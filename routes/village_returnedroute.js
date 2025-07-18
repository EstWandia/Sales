import express from 'express';
import {getReturnedItems,confirmReturnedItem} from '../controllers/village_returncont.js';
import { checkAuth } from '../middleware/checkAuth.js';


const router=express.Router();
//const db = query()

router.get('/returned',checkAuth,getReturnedItems);
router.put('/retstore/:id/confirm', checkAuth, confirmReturnedItem);


export default router;

