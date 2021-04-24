const Attr = require('../attr')
const error = require('../parse/error')

const maxInt = {
	tiny: 255,
	medium: 2 ** 31
}

const minInt = {
	tiny: -254,
	medium: -(2 ** 31) + 1
}

const name = {
	tiny: 'smallint',
	medium: 'INT'
}

class Int extends Attr {
	constructor(param) {
		var variableSql = ''
		var type = ''
		var size = ''
		if (param.float) {
			variableSql = 'float'
			type = 'float'
		} else {
			size = param.size || 'medium'
			variableSql = name[size]
			type = 'int'
		}

		super({
			name: param.name,
			type: type,
			update: param.update,
			filter: param.filter,
			notnull: param.notnull,
			variableSql: variableSql,
			sort: param.sort,
			required: param.required
		})

		this.float = param.float
		if (!this.float) {
			this.min = param.min || minInt[size]
			this.max = param.max || maxInt[size]
		}
	}
	async parse(value) {
		var elem = value
		if (elem == null) {
			if (this.notnull) return error.uncomplete(this.name)
			else return 'null'
		}

		if (this.float) return parseFloat(elem)

		if (!/^\d+$/.test(elem))
			return error.badType(
				this.name,
				'int',
				'must be null or Number type'
			)
		elem = parseInt(elem)
		if (this.min && elem < this.min) return error.minimumError(this.min)
		else if (this.max && elem > this.max)
			return error.maximumError(this.max)
		else if (elem < minInt.medium) return error.minimumError(minInt.medium)
		else if (elem > maxInt.medium) return error.maximumError(maxInt.medium)
		return elem
	}

	wrapper(elem) {
		if (elem == null) return 'null'
		return elem
	}

	//wrapper before implement
	//parser after extraction
	//checker before ask implement

	//check -> wrap -> request -> parser -> return
}

module.exports = Int
