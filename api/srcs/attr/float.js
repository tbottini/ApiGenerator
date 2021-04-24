const Attr = require('../attr')
const error = require('../parse/error')

class Float extends Attr {
	constructor(param) {
		param.variableSql = 'float'
		param.type = 'float'

		super(param)
	}

	async parse(value) {
		return parseFloat(value)
	}

	wrapper(elem) {
		return elem || 'null'
	}
}

module.exports = Float
