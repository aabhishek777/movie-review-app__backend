// const MAIL_SETTINGS=  {
//     service: 'gmail',
//     auth: {
//       user: process.env.MAIL_EMAIL,
//       pass: process.env.MAIL_PASSWORD,
//     },
//   }
    
import nodemailer from 'nodemailer'

export const SEND_MAIL= (otp, email)=>{

let transporter = nodemailer.createTransport({
    service: 'Gmail',  // You can use other services like Outlook, Yahoo, etc.
    auth: {
        user: 'abhisheksinghqsstechnosoft@gmail.com',  // Your email address
        pass: 'vciydvefroeheeiq'   // Your email password
    }
});

// Define the email options
let mailOptions = {
    from: 'your.email@gmail.com',  // Sender address
    to: email,   // List of recipients
    subject: 'Test Email',         // Subject line
    text: `hello your otp is :  ${otp}` // Plain text body
};

// Send the email


transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error occurred:', error.message);
    } else {
        console.log('Email sent:', info.response);
    }
});
}