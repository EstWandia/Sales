import express from 'express';
import { Category,getcategoryItem,getcategoryUpdate,getcategoryDelete,createCategory,Categorydisplay,finishedItems} from '../controllers/village_itemscategory.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router =express.Router();

router.get('/itemscategory',checkAuth,Category);
router.get('/displaycategory',checkAuth,Categorydisplay);
router.get('/item/:id',checkAuth, getcategoryItem);
router.put('/update/:id',checkAuth, getcategoryUpdate);
router.delete('/deleted/:id',checkAuth,getcategoryDelete);
router.post('/create',checkAuth, createCategory);
router.get('/deplict',checkAuth,finishedItems);


export default router