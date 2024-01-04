import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import logger from 'src/loggerfile/logger';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',

    port: 587,
    secure: false,
    auth: {
      user: `${process.env.MAIL_SENDER}`,
      pass: `${process.env.MAIL_PASSWORD}`
    },
  });

  async sendEmail(username:string, email: string, otp: number): Promise<any> { //this prototype is used to send the otp throw mail to reset password
    const mailOptions = {
      from: `"name project" <${process.env.MAIL_SENDER}>`,
      to: email, //reciver mail
      subject: 'Email Verification',
      html: `
        <p>Dear ${username} </p>
        <p>${otp} is your one time password (OTP). Please do not share the otp with others.</p><br/>
        <p>Regards,</p>
        <p>Team {service provider name}</p>
      `,
    };

    try {
      logger.debug('Email sending started');
      const info = await this.transporter.sendMail(mailOptions);
      logger.debug(`Email sent:${ info.response}`);
      if (info)
        return { Error:false, message:"Email sent" };
      throw info;
    } catch (error) {
      logger.error(`Error in sending email: ${ error }`);
      return { Error:true, message: (typeof error == 'object' ? error.message : error) };
    }
  }
}
