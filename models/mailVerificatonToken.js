import mongoose from "mongoose";

// mailverification_is _not_live_at_the_Moment_ILL work onit in future


export const emailVerificationTokenSchema = mongoose.Schema({

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"  
    }
    ,
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        expires:360000,
        default:Date.now()
    }
})


export default mongoose.model("EmailVerificationToken",emailVerificationTokenSchema)