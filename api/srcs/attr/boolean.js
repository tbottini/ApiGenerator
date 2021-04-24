const Attr = require('../attr')

class Boolean extends Attr {
	constructor(param) {
		var type = 'boolean'
		var variableSql = type

		super({
			name: param.name,
			type: type,
			update: param.update,
			filter: param.filter,
			notnull: param.notnull,
			variableSql: variableSql
		})
		this.default = param.default || 'null'
	}

	decode(value) {
		return value == true || value == 1
	}

	async parse(value) {
		if (value == 1) value = 'true'
		else if (value == 0) value = 'false'
		return value
	}

	wrapper(elem) {
		return elem == null ? this.default : elem
	}
}

module.exports = Boolean
