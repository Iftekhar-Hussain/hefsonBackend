"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SENDEMAIL = exports.htmlFromatWithObject = exports.emails = exports.subjects = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _nodemailerSmtpTransport = _interopRequireDefault(require("nodemailer-smtp-transport"));

var _path = _interopRequireDefault(require("path"));

var _emailTemplates = require("email-templates");

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* -----------------------------------------------------------------------
   * @ description : Here initialising nodemailer transport for sending mails.
----------------------------------------------------------------------- */
const sgMail = require('@sendgrid/mail');

const {
  smtpUser,
  smtpPass,
  smtpPort,
  smtpServer,
  mailFrom
} = _config.default.get("smtp");

const {
  frontendUrl,
  SEND_GRID_KEY,
  logoUrl,
  facebook,
  whiteLogo,
  instagram,
  linkedin,
  twitter
} = _config.default.get("app"); // sgMail.setApiKey(SEND_GRID_KEY);


const transporter = _nodemailer.default.createTransport((0, _nodemailerSmtpTransport.default)({
  host: smtpServer,
  // hostname
  port: smtpPort,
  // port for secure SMTP
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
}));

const subjects = {
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
  shipment: "Hefson - Shipment has been",
  expire: "Hefson - Renew the registartion of your",
  alarmAlert: "Hefson - Alarm alert on " //   newUserRequest: role => `Request as ${role}`

};
exports.subjects = subjects;
const emails = {
  admin: "starsin@yopmail.com"
};
exports.emails = emails;
const dirPath = "../email-templates/";

const htmlFromatWithObject = async request => {
  request['home'] = `${frontendUrl}`;
  request['logo'] = `${logoUrl}`;
  request['facebook'] = `${facebook}`;
  request['instagram'] = `${instagram}`;
  request['linkedin'] = `${linkedin}`;
  request['twitter'] = `${twitter}`;
  request['whiteLogo'] = `${whiteLogo}`;
  console.log(__dirname + dirPath + request.emailTemplate);

  const tempDir = _path.default.resolve(__dirname, dirPath, request.emailTemplate);

  const template = new _emailTemplates.EmailTemplate(_path.default.join(tempDir));
  const html = await template.render({ ...request
  });
  return { ...html,
    request
  };
};

exports.htmlFromatWithObject = htmlFromatWithObject;

const SENDEMAIL = (request, cb) => {
  let options = {
    from: mailFrom,
    to: request.to,
    // list of receivers
    subject: request.subject,
    // Subject line
    html: request.html // html body

  };

  if (request.cc) {
    options.cc = request.cc;
  }

  if (request.replyTo) {
    options.replyTo = request.replyTo;
  }

  if (request.files) {
    options.attachments = [{
      // filename: request.files.fileName,
      path: request.files.content // type: 'application/pdf',
      // disposition: 'attachment'

    }];
  } // Send by send grid  
  // console.log("options",JSON.stringify(options));
  // sgMail.send(options);
  // Send by node mailer


  transporter.sendMail(options, function (error, info) {
    // send mail with defined transport object
    cb(error, info);
  });
};

exports.SENDEMAIL = SENDEMAIL;