var mailer = require('nodemailer')
const fs = require('fs')

//transporter who use gmail service
function createGmailService() {
	return mailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.SENDER_MAIL,
			pass: process.env.SENDER_MAIL_PSW
		}
	})
}

createGmailService()

//TODO incopore into MailSender contructor variable
var personnalHostEmail = 'thomasbottini@protonmail.com'

class MailSender {
	constructor() {
		this.transporter = createGmailService()
	}

	async send(
		subject,
		addr,
		content,
		attachments,
		sender = 'no-rply@lichen.com'
	) {
		var mailOptions = {
			from: sender,
			to: addr,
			subject: subject,
			html: content,
			attachments: attachments
		}

		console.log('sendmail: ' + subject + ' to ' + addr)
		var res = await this.transporter.sendMail(mailOptions)
		console.log(res)
		//else console.log("Email sent: " + info.response);
	}

	async resetPassword(addr, token) {
		var content = fs
			.readFileSync('./views/mail/resetPassword.html')
			.toString()
			.split('<token>')
			.join(token)

		send('Forgot Password', addr, content, [
			{
				filename: 'lock.svg',
				path: './views/lock.svg',
				cid: 'unique@nodemailer.com'
			}
		])
	}

	async notificationMail(email, message) {
		var content = fs
			.readFileSync(__dirname + '/../views/notifMail.html')
			.toString()
			.split('<email>')
			.join(email)
			.split('<message>')
			.join(message)
		send('Notification', personnalHostEmail, content, [])
	}

	close() {
		this.transporter.close()
	}
}

module.exports = {
	MailSender: MailSender,
	createGmailService: createGmailService,
	notificationMail: MailSender.notificationMail,
	resetPassword: MailSender.resetPassword
}
