

import mongoose from "mongoose";

const actorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },
    about:{
        type:String,
        required:true,
        trim:true,
    },
    gender:{
        type:String,
        required:true
    },
   avatar:{
    type:Object,
    url:String,
    public_id:String
   }
}
,{timestamps:true}
);

actorSchema.index({name:'text'})
const Actor = mongoose.model('Actor',  actorSchema);

export default Actor;