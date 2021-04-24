var mjml = require('mjml')
const fs = require('fs')
const { MailSender } = require('./mail')
const mailSender = new MailSender()

const SRC_MAIL = './assets/email/'

function readMjml(file) {
	var file = fs.readFileSync(SRC_MAIL + file + '.mjml')
	file = file.toString()
	return file
}

function templatevar(file, name, value) {
	return file.replace(name, value)
}

class MjmlFile {
	constructor(url) {
		this.email = readMjml(url)
		this.initState = this.email
	}

	set(varname, value) {
		this.email = templatevar(this.email, '$' + varname, value)

		return this
	}

	generate() {
		const basic = wrapBasic(this.email)

		const emailComplete = mjml(basic)
		return emailComplete.html
	}

	get() {
		return this.email
	}

	reset() {
		this.email = this.initState
	}

	send(to, title) {
		const emailBody = this.generate()

		if (process.env.NODE_ENV == 'development') {
			console.log('CHANGE ADRESS - mode development')
			to = 'thomasbottini@protonmail.com'
			title = 'TEST - ' + title
		}

		mailSender.send(title, to, emailBody)

		return { msg: 'the email has been sent' }
	}
}

var basicTemplate

function generateBasic(param) {
	const {
		linkFacebook,
		linkInstagram,
		linkYoutube,
		linkSoundcloud,
		linkTwitter
	} = param
	var basic = readMjml('basic')
	basic = templatevar(basic, '$link-facebook', linkFacebook)
	basic = templatevar(basic, '$link-instagram', linkInstagram)
	basic = templatevar(basic, '$link-youtube', linkYoutube)
	basic = templatevar(basic, '$link-soundcloud', linkSoundcloud)
	basic = templatevar(basic, '$link-twitter', linkTwitter)
	basicTemplate = basic
	return basic
}

function wrapBasic(body) {
	return templatevar(basicTemplate, '$email-body', body)
}

function panier(param, header) {
	const { achat, frais_port, addr, total } = param
	var panier = new MjmlFile('panier')
	const lh = new MjmlFile('lineAchat')

	const linesHtml = achat
		.map((a, i) => {
			if (i != 0) lh.reset()
			lh.set('title', a.title).set('price', a.price).set('src', a.src)
			return lh.get()
		})
		.join('')

	panier
		.set('cell', linesHtml)
		.set('price', total)
		.set('frais', frais_port)
		.set('addr', addr)
		.set('header', header)

	return panier
}

function panierUser(purchases) {
	const panierUser = new MjmlFile('panierHeaderUser')
	return panier(purchases, panierUser.get())
}

function panierAdmin(purchases) {
	var panierAdmin = new MjmlFile('panierHeaderAdmin')
	return panier(
		purchases,
		panierAdmin
			.set('phone', purchases.phone || 'pas renseigné')
			.set('email', purchases.user.email)
			.set('lastname', purchases.user.lastname)
			.set('firstname', purchases.user.firstname)
			.get()
	)

	//return panier(purchases, header);
}

function resetPassword(param) {
	var resetMail = new MjmlFile('reinit')
	return resetMail
		.set('password', param.password)
		.set('id', param.id)
		.set('firstname', param.firstname)
		.set('lastname', param.lastname)
}

function mailConfirmationNewAccount(param) {
	var confirmationMail = new MjmlFile('confirmation')
	return confirmationMail
		.set('firstname', param.firstname)
		.set('lastname', param.lastname)
}

module.exports = {
	panier,
	resetPassword,
	init: generateBasic,
	panierUser,
	panierAdmin,
	mailConfirmationNewAccount
}
