var mailer = require("nodemailer");
const fs = require("fs");

//transporter who use gmail service
function createGmailService() {
  return mailer.createTransport({
    service: "gmail",
    auth: {
      user: "atelier.azurees@gmail.com",
      pass: "atelier1234"
    }
  });
}

//TODO incopore into MailSender contructor variable
var personnalHostEmail = "thomasbottini@protonmail.com";

class MailSender {
  constructor(transporter) {
    this.transporter = transporter;
  }

  send(
    subject,
    addr,
    content,
    attachments,
    sender = "no-rply@atelier-azurees.com"
  ) {
    var mailOptions = {
      from: sender,
      to: addr,
      subject: subject,
      html: content,
      attachments: attachments
    };

    console.log("sendmail: " + subject + " to " + addr);
    this.transporter.sendMail(mailOptions, function(error, info) {
      if (error) console.log(error);
      else console.log("Email sent: " + info.response);
    });
  }

  async resetPassword(addr, token) {
    var content = fs
      .readFileSync("./views/mail/resetPassword.html")
      .toString()
      .split("<token>")
      .join(token);

    send("Atelier Azurees Forgot Password", addr, content, [
      {
        filename: "lock.svg",
        path: "./views/lock.svg",
        cid: "unique@nodemailer.com"
      }
    ]);
  }

  async notificationMail(email, message) {
    var content = fs
      .readFileSync(__dirname + "/../views/notifMail.html")
      .toString()
      .split("<email>")
      .join(email)
      .split("<message>")
      .join(message);
    send("Atelier Azurees Notification", personnalHostEmail, content, []);
  }
}

module.exports = {
  MailSender: MailSender,
  createGmailService: createGmailService,
  notificationMail: MailSender.notificationMail,
  resetPassword: MailSender.resetPassword
};
