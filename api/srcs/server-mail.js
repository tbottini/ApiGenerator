const db = require("./sqlite");

const SMTPServer = require("smtp-server").SMTPServer;
const parser = require("mailparser").simpleParser;
const PORT = 25;
const nodemailer = require("nodemailer");
const fs = require("fs");
const MailSender = require("./mail").MailSender;

class MailServer {
  constructor(hostname, callbackReceive) {
    if (process.env.HOST != "localhost") {
      this.server = new SMTPServer({
        onData(stream, session, callback) {
          //receive email
          parser(stream, {}, (err, parsed) => {
            if (err) console.log("Error:", err);

            callbackReceive(parsed);

            console.log(parsed);
            stream.on("end", callback);
          });
        },
        disabledCommands: ["AUTH"]
      });
      this.server.listen(PORT);

      this.transporter = nodemailer.createTransport({
        port: 25,
        host: hostname,
        secure: false
      });

      this.sender = new MailSender(transporter);

      console.log("Mail Server listen to : ", PORT);
    }
  }

  send(from, to, title, content) {
    if (process.env.HOST != "localhost")
      this.sender.send(title, to, content, [], from);
  }
}

module.exports = MailServer;
