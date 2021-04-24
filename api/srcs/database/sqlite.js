const sqlite3 = require('sqlite3').verbose()
const util = require('util')

class Sqlite3Controller {
	constructor() {
		let db = new sqlite3.Database('./db', (err) => {
			if (err) {
				return console.error(err.message)
			}
			console.log('Connected to SQlite')
		})

		function replaceToken(str, array) {
			array.forEach((p) => {
				str = str.replace('?', p)
			})
			return str
		}

		function gen_token_function(fct_name) {
			db[fct_name + '_old'] = util.promisify(db[fct_name])
			return async function (sql, params) {
				if (params) {
					sql = replaceToken(sql, params)
				}
				return await db[fct_name + '_old'](sql)
			}
		}

		db.run = gen_token_function('run')
		db.get = gen_token_function('get')
		db.all = gen_token_function('all')

		this.db = db
	}

	run(sql) {
		return this.db.run(sql)
	}

	get(sql) {
		return this.db.get(sql)
	}

	all(sql) {
		return this.db.all(sql)
	}
}

module.exports = Sqlite3Controller
