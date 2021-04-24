const Int = require('./int')
const error = require('../parse/error')
const parse = require('../parse/parser')

class Index extends Int {
	constructor(param) {
		super(param)
		this.type = 'index'
	}

	//variable without insert value, automatic
	strInsert(tableName) {
		// return `(select coalesce((select 1 + max(index) from ${tableName}), 1)`;
		return `(select coalesce((select 1 + max(index) from ${tableName}), 1))`
	}
}

module.exports = Index
