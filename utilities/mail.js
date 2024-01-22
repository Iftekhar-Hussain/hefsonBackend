/* -----------------------------------------------------------------------
   * @ description : Here initialising nodemailer transport for sending mails.
----------------------------------------------------------------------- */

import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import path from "path";
import { EmailTemplate } from "email-templates";
const sgMail = require('@sendgrid/mail');
import config from "config";
const { smtpUser, smtpPass, smtpPort, smtpServer, mailFrom } = config.get("smtp");
const { frontendUrl, SEND_GRID_KEY, logoUrl, facebook, whiteLogo, instagram, linkedin, twitter } = config.get("app");

// sgMail.setApiKey(SEND_GRID_KEY);

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: smtpServer, // hostname
    port: smtpPort, // port for secure SMTP
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  })
);

export const subjects = {
  forgetPassword: "Hefson - Forgot Passsword",
  registerRequest: "Hefson - Sign Up",
  addDriver: "Hefson - Login Details",
  verifyEmail: "Hefson - Verify Email",
  updateBooking: "Hefson - Booking Update",
  contactAdmin: "Hefson - Contact Admin",
  bookingReminder: "Hefson - Booking Reminder",
  adminEmail: "StarsIn Update",
  completeBooking: "Request Complete",
  vacationReminder: "Vacation Mode Off Reminder",
  shareLink: "Hefson - Live shipment details",
  serviceHour: "Hefson - Service your Trailer",
  shipment:"Hefson - Shipment has been",
  expire: "Hefson - Renew the registartion of your",
  alarmAlert:"Hefson - Alarm alert on "
  //   newUserRequest: role => `Request as ${role}`
};

export const emails = {
  admin: "starsin@yopmail.com"
};

const dirPath = "../email-templates/";

export const htmlFromatWithObject = async request => {
  request['home'] = `${frontendUrl}`;
  request['logo'] = `${logoUrl}`;
  request['facebook'] = `${facebook}`;
  request['instagram'] = `${instagram}`;
  request['linkedin'] = `${linkedin}`;
  request['twitter'] = `${twitter}`;
  request['whiteLogo'] = `${whiteLogo}`;
  console.log(__dirname + dirPath + request.emailTemplate)
  const tempDir = path.resolve(__dirname, dirPath, request.emailTemplate);
  const template = new EmailTemplate(path.join(tempDir));
  const html = await template.render({ ...request });
  return { ...html, request }
};

export const SENDEMAIL = (request, cb) => {
  let options = {
    from: mailFrom,
    to: request.to, // list of receivers
    subject: request.subject, // Subject line
    html: request.html // html body
  };

  if (request.cc) {
    options.cc = request.cc;
  }
  if (request.replyTo) {
    options.replyTo = request.replyTo;
  }
  if (request.files) {
    options.attachments = [
      {
        // filename: request.files.fileName,
        path: request.files.content
        // type: 'application/pdf',
        // disposition: 'attachment'
      }
    ];
  }
  // Send by send grid  
  // console.log("options",JSON.stringify(options));
  // sgMail.send(options);

  // Send by node mailer
  transporter.sendMail(options, function (error, info) {
    // send mail with defined transport object

    cb(error, info);
  });
};
