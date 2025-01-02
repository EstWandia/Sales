import express from 'express';
import { Getallitems,getItembyid,getUpdatebyid,getDeletebyid,createbyid} from '../controllers/itemstosale.js'


const router =express.Router();

router.get('/sale',Getallitems);
router.get('/itemsview/:id', getItembyid);
router.put('/itemsupdate/:id', getUpdatebyid);
router.delete('/itemsdeleted/:id',getDeletebyid);
router.post('/itemscreate', createbyid);


export default router