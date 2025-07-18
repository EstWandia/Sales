import express from 'express'
import {getAllSoldItems,getItem,getUpdate,getDelete,soldPerm} from '../controllers/village_allsolditems.js'
import { checkAuth } from '../middleware/checkAuth.js';



const router =express.Router();

router.get('/allsold',checkAuth,getAllSoldItems);
router.get('/item/:id',checkAuth, getItem);
router.put('/update/:id',checkAuth, getUpdate);
router.delete('/deleted/:id',checkAuth,getDelete);
router.get('/soldpermision',checkAuth,soldPerm);

export default router