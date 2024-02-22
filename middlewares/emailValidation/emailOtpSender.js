import User from "../../schema/user.js";
import { SEND_MAIL } from "../../services/emailService.js";

const max= 999999;
const min= 100000;
const otp = Math.floor(Math.random() * (max - min + 1)) + min;


export const isValidMail= async (req, res, next)=>{

    const {email} = req.body;
    try {
        const user= await User.find({email});
        if(user[0]>0){
            return res.status(400).json({msg:'email already exist'})
        }
        
        console.log(otp);
        

        SEND_MAIL(otp,email);
        next();


        
    } catch (error) {
        res.status(400).json({error})
        console.log(error);
    }
    
}

