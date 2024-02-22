import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'drmzjfljd', 
  api_key: '534188919418388', 
  api_secret:'1dXQixw70VHmnvkFLnUa-yCLkXA', //process.env.CLOUDINAY_API_KEY_SECRET,//'1dXQixw70VHmnvkFLnUa-yCLkXA' //1dXQixw70VHmnvkFLnUa-yCLkXA
  secure:true
});

export default cloudinary;