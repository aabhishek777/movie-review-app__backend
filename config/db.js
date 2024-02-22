
import mongoose from "mongoose";


export const getConnection =async ()=>{
    try {
      await  mongoose.connect(process.env.MONGODB_URI);
      console.log('db connected successfully!')
        
    } catch (error) {
        console.log(error);
        
    }
 
}
