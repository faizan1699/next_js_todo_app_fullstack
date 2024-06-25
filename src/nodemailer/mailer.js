


import nodemailer from 'nodemailer';
import User from '@/models/usermodels';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }) => {

    

    try {
        // create hash token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000, // 1 hour
            });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgetpassToken: hashedToken,
                forgetpassTokenExpiry: Date.now() + 3600000, // 1 hour
            });
        }

        var  transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "0d07f0e7652f65",
              pass: "86d1ed31748d16"
            }
          });

        const mailOption = {
            from: 'faizanrasheed169@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        };

        const mailresponse = await transport.sendMail(mailOption);
        return mailresponse;

    } catch (error) {
       console.log(error)
    }
};
