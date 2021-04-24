const Controller = require('../controllerClass/controller.js')
const hash = require('../parse/hash')
const parse = require('../parse/parser')
const ERROR = require('../parse/error')

class UserController extends Controller {
	constructor(param) {
		super(param)
	}

	async auth(mail, password) {
		var user = await this.db.get(
			'select * from  ' + this.name + " where email = '\\?'",
			[mail]
		)
		if (!user) {
			return { error: 'no entry found' }
		} else if (!(await hash.verify(user.password, password))) {
			return { error: 'bad password provide' }
		}
		delete user.password
		return user
	}

	async getAdmin() {
		var admin = await this.db.get(
			'select id, email, isadmin from  ' +
				this.name +
				' where isadmin = true'
		)
		return admin
	}

	async getPassword(email) {
		var user = await this.db.get(
			'select id, password, firstname, lastname from ' +
				this.name +
				" where email = '" +
				email +
				"'"
		)
		return this.decodeObject(user)
	}

	//different from Standard Password setter function because
	//ths password is check with hash and not clear
	//can have password only with email of reinit
	async updatePassword(id, newPassword, previousPasswordHash) {
		const user = await this.db.get(
			'select password from ' + this.name + ' where id = ' + id
		)

		const CONFIRM = user.password == previousPasswordHash

		if (CONFIRM) {
			if (!parse.checkPassword(newPassword)) return ERROR.formatpassword
			const pswHash = await hash.hash(newPassword)
			return await this.db.run(
				'update ' +
					this.name +
					" set password = '" +
					pswHash +
					"' where id = " +
					id
			)
		} else {
			return { error: 'password doenst correspond' }
		}
	}
}

module.exports = UserController
