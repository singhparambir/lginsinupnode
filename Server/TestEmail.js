import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'parambirsinghit@gmail.com', // Replace with your test email
    subject: 'Test Email',
    html: '<p>This is a test email.</p>',
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.error('Error in test email:', error);
    }
    console.log('Email sent: ' + info.response);
});
