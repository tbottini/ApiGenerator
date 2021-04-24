console.log(process.env.STRIPE_KEY)
const stripe = require('stripe')(process.env.STRIPE_KEY)

class StripeHandler {
	constructor() {
		this.stripe = stripe
		this.currency = 'eur'
	}

	async generatePayment(amount, id_user, description) {
		amount = parseInt(amount * 100)
		const payment = await this.stripe.paymentIntents.create({
			amount,
			currency: this.currency,
			description: description,
			metadata: {
				id_user: id_user // TODO add id_purchase setup the serverside process payment
			}
		})
		return { clientSecret: payment.client_secret }
	}
}

const stripeHandler = new StripeHandler()

module.exports = stripeHandler
