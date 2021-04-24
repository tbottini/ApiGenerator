var Attr = require('../attr.js')
const parse = require('../parse/parser')

class Str extends Attr {
	constructor(param) {
		var variableSql = param.area ? 'text' : 'varchar(200)'
		var type = 'string'
		//super(param.name, "string", param.type, param.notnull, param.update);

		super({
			name: param.name,
			type: type,
			update: param.update,
			filter: param.filter,
			notnull: param.notnull,
			variableSql: variableSql,
			required: param.required,
			search: param.search
		})

		this.unique = param.unique
		this.default = param.default
		this.regex = param.regex
	}

	/**
	 * make the data secure for the database
	 * no sql injection
	 * @param {*} value
	 * @returns
	 */
	async parse(value) {
		if (this.regex) {
			if (!this.regex.test(value))
				return { error: 'bad format for ' + this.name }
		}
		return parse.secureSql(value)
	}

	/**
	 * makes the data usable by the database
	 * @param {*} elem
	 * @param {*} object
	 * @returns
	 */
	wrapper(elem, object) {
		if (this.default && !elem) {
			if (Array.isArray(this.default) && object) {
				elem = this.default.reduce((a, b) => {
					b = object[b] || ''
					var l = a ? '-' : ''
					return a + l + b
				}, '')
			} else elem = this.default
		}
		return `'${elem || ''}'`
	}

	decode(value) {
		return parse.decode(value)
	}

	getSearchSql(token) {
		var sql = token
			.split(' ')
			.filter((a) => a)
			.map((a) => this.name + " ~* '" + a + "'")
			.join(' or ')
		return sql
	}
}

module.exports = Str
