import express from 'express'
import { getRegisterData,getloginUser,logOut, loggedInuser,getLoginName} from '../controllers/authentication.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { noCache } from '../middleware/nocache.js';
 

const router=express.Router();

router.post('/userdetails',getRegisterData)
router.post('/userlogin',getloginUser)
router.post('/logout', checkAuth,logOut)
router.get('/users',checkAuth,loggedInuser)
router.get('/loginname',checkAuth,getLoginName)




export default router