import express from 'express';
import { Category,getcategoryItem,getcategoryUpdate,getcategoryDelete,createCategory} from '../controllers/itemscategory.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router =express.Router();

router.get('/itemscategory',checkAuth,Category);
router.get('/item/:id', getcategoryItem);
router.put('/update/:id', getcategoryUpdate);
router.delete('/deleted/:id',getcategoryDelete);
router.post('/create', createCategory);

export default router