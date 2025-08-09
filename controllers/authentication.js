import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import db from '../models/index.js';
import { noCache } from '../middleware/nocache.js';

const { users } = db;

export const getRegisterData=async(req,res)=>{
    try{
        const {email,name,password} =req.body
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newPerson = await users.create ({
            email:email,
            name:name,
            password:hashedPassword,
        }) ;
        res.json({success:true, message:'user registered sucessfully'})
    }catch(error){
        console.error('error saving the data:',error)
        res.status(500).json({success:false,message:'Error saving Data'})
    }
}
export const getloginUser=async(req,res)=>{
  
    try{
        const {email,password}=req.body        
        const secret = process.env.JWT_SECRET;
        if (!secret) { throw new Error("JWT_SECRET is not defined"); }
        if(!email || !password){
            return res.status(400).json({success:false,message:'email or password needed'})
        }
        const user =await users.findOne({where :{email}})
        if(!user){
            return res.status(401).json({success:false,message:'You are not allowed to this app'})
        }

        const isPasswordValid=await bcryptjs.compare(password,user.password)
        if(!isPasswordValid){
            return res.status(401).json({success:false,message:'Wrong email or password'})
        }
        const payload ={
            id:user.id,
            email:user.email
        };
        const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '1h' }); // Correct usage with options
        res.cookie('auth_token',token,{httpOnly:true,secure:true,maxAge:3600000})

        req.session.user = {
            id: user.id,
            email: user.email,
            perm: user.perm,
        };
        res.json({
            success:true,
            message:'Youve succesfully login',
            data:{
                userId:user.userId,
                email:user.email,
                name:user.name,
                perm:user.perm
            }
        })

    }catch(error){
        console.error('Error during loging in',error);
        res.status(500).json({success:false,message:'error occured while logging in'})
    }
}
export const logOut=async(req,res)=>{

       res.clearCookie('auth_token',{'path': '/'});
       noCache(req,res,()=>{
        res.json({ success: true, message: 'Logged out successfully' });
       })
       
}
export const loggedInuser =async (req,res)=>{
    try{
              const allUsers = await users.findAll();
              const formattedUsers = allUsers.map(user => ({
                ...user.toJSON(),
                created_at: user.createdAt?user.createdAt.toISOString().split('T')[0]:'N/A'// Example: YYYY-MM-DD
            }));
              res.render('index',{ users: formattedUsers });
    }catch(error){
        //console.log(error);
              res.status(500).send('Internal Server Error');

    }
}
export const getLoginName = async (req, res) => {
    try {
      const userId = req.user.id;
      //console.log('User ID:', userId);

  
      const user = await users.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({
        success: true,
        user: {
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      console.error('Error fetching user details:', err.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };  