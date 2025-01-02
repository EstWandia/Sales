import express from 'express'
import {getAllSoldItems,getItem,getUpdate,getDelete} from '../controllers/allsolditems.js'



const router =express.Router();

router.get('/allsold',getAllSoldItems);
router.get('/item/:id', getItem);
router.put('/update/:id', getUpdate);
router.delete('/deleted/:id',getDelete)

export default router