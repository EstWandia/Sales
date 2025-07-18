import express from 'express';
import { Getallitems,getItembyid,getUpdatebyid,getDeletebyid,createbyid,getinstockItems,allPerm} from '../controllers/village_itemstosale.js'
import { checkAuth } from '../middleware/checkAuth.js';



const router =express.Router();

router.get('/sale',checkAuth,Getallitems);
router.get('/itemsview/:id',checkAuth,getItembyid);
router.put('/itemsupdate/:id',checkAuth,getUpdatebyid);
router.delete('/itemsdeleted/:id',checkAuth,getDeletebyid);
router.post('/itemscreate',checkAuth,createbyid);
router.get('/instock',checkAuth,getinstockItems);
router.get('/allpermision',checkAuth,allPerm);




export default router