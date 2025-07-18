import express from 'express'
import {checkAuth} from '../middleware/checkAuth.js'
import {Debt} from '../controllers/debtcontr.js'


const router =express.Router();


router.get('getdebt',checkAuth,Debt)


export default router;





