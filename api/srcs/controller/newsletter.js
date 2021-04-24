const Controller = require('../controllerClass/controller')

class NewsletterController extends Controller {
	constructor(param) {
		super(param)
	}

	async getAll() {
		var users = await this.db.all(
			'select email from users where follow_newsletter = true'
		)
		users = users.map((u) => u.email)
		var newsletter = await this.db.all('select email from newsletter')
		newsletter = newsletter.map((n) => n.email)

		newsletter = newsletter.concat(users)
		newsletter = newsletter.filter(function (elem, pos) {
			return newsletter.indexOf(elem) == pos
		})

		return newsletter
	}
}

module.exports = NewsletterController
