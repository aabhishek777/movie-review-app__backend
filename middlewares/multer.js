
import multer from 'multer';

const storage= multer.diskStorage({})

const imagefileFilter= (req, file, cb)=>{
    if(!file.mimetype.startsWith('image')){
        cb('supported only image file', false)
    }
   
    cb(null, true) // parameters---- fist error second is next objet to process further
}


const videofileFilter= (req, file, cb)=> {
    if(!file.mimetype.startsWith('video')){
        cb('supported only video file',false)
    }
    cb(null, true)
}




export const uploadImage= multer({storage, fileFilter:imagefileFilter});
export const uploadVideo = multer({storage, fileFilter:videofileFilter});

