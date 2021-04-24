const Model = require('../model')
const NewsletterController = require('../controller/newsletter')

class NewsletterModel extends Model {
	constructor(param) {
		param.Controller = NewsletterController
		super(param)
	}
}

module.exports = NewsletterModel
