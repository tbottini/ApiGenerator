const Controller = require('../controllerClass/controller')

class PurchasesController extends Controller {
	constructor(param) {
		super(param)
	}

	create(param) {
		//doit ajouter au purchases_elements
		//et doit post au purchases
	}

	shippingCalculation(w, totalPrice) {
		if (totalPrice >= 100) return 0

		if (w < 0.02) return 1.08
		else if (w < 0.1) return 2.16
		else if (w < 0.25) return 3.94
		else if (w < 0.5) return 5.91
		else return 8.64
	}

	async calculation(cart) {
		const sqlCondition = cart
			.map((item) => {
				return 'poem.id = ' + item.id
			})
			.join(' or ')
		const sql =
			'select poem.id as id, poem.weight as weight, \
      poem.title, poem.illustration, \
      collection.weight_default as weight_default, poem.price as price from poem left join collection on collection.id = poem.id_collection where ' +
			sqlCondition
		var poems = await this.db.all(sql)
		if (poems.length != cart.length)
			return { error: 'there are bad poems provide' }

		cart = cart.map((item) => {
			var poem = poems.find((p) => p.id == item.id)
			if (!poem) console.error('no poem find')
			return {
				...item,
				price: poem.price,
				weight: poem.weight || poem.weight_default || 0.2,
				title: poem.title,
				illustration: poem.illustration
			}
		})

		var totalWeight = 0
		var totalPrice = 0
		cart.forEach((buyPoem) => {
			totalWeight += buyPoem.weight * buyPoem.quantity
			totalPrice += buyPoem.price * buyPoem.quantity
		})
		const shippingPrice = this.shippingCalculation(totalWeight, totalPrice)
		console.log(
			'total price',
			totalPrice,
			'shipping price',
			shippingPrice,
			'total weight',
			totalWeight
		)
		return {
			poemPrice: totalPrice,
			shippingPrice,
			total: totalPrice + shippingPrice,
			cart
		}
	}
}

module.exports = PurchasesController
