import nodemailer from "nodemailer"
import { asyncHandler } from "./asyncHandler.js"

const sendEmail = asyncHandler(async({to, subject, html})=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    })

    const mailOptiions = {
        from: `"MODera" <no-reply@MODera.com>`,
        to,
        subject,
        html
    }

    await transporter.sendMail(mailOptiions);
})

export { sendEmail }