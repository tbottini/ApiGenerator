const Int = require('./int')

class Enum extends Int {
	constructor(param) {
		super(param)

		if (!param.values)
			console.error('no values defined for attr ' + this.name)
		this.values = param.values
		this.variableSql = 'smallint'
		this.type = 'enum'
	}

	async parse(value) {
		return this.values.indexOf(value)
	}

	decode(value) {
		if (value === undefined || value === null) return null
		return this.values[value]
	}

	wrapper(value) {
		if (value == null) return 'NULL'
		return value
	}
}

module.exports = Enum
