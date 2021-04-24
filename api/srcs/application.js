'use strict'
const glob = require('glob')
const path = require('path')

/**
 * handles different models
 */
class Application {
	constructor({ database = 'postgresql', config, app, name }) {
		const DatabaseController = require('./database/' + database)

		if (name == null)
			console.warn("Application: name attribute isn't provide")
		if (app == null) console.error("Application: express app isn't provide")

		this.db = new DatabaseController(config)
		this.app = app
		this.models = []
		this.routers = []
		this.name = name

		this.init()

		console.log('Api ', this.name, ' was created')
	}

	get database() {
		return this.db
	}

	init() {}

	/**
	 *
	 * @param {Object} conf for fetch each model
	 * @param {String} modelPath the path of directory of models
	 */
	active(modelPath) {
		this._fetchModels(modelPath)
		this.activeModel()
	}

	activeModel() {
		this.models.forEach((model) => {
			model.active(this.db)
		})
	}

	//search and get router in special folders

	_fetchModels(dirname) {
		if (!dirname) dirname = './models/'
		if (dirname[dirname.length - 1] != '/') dirname += '/'
		dirname += '*.js'

		console.log('Application: models find in ' + dirname)

		glob.sync(dirname).forEach((filename) => {
			var model = require(filename)
			const name = path.basename(filename)

			const nameRoute = name.split('.').slice(0, -1).join('.')

			try {
				var router = model.getRouter()
				this.models.push(model)

				this.app.use(`/${nameRoute}`, router)
				console.log('Application: start listen /' + nameRoute)
			} catch (e) {
				console.warn(
					'Application:',
					name,
					" wrong model object > can't generate router"
				)
				//console.log(e);
			}
		})
	}
}

module.exports = Application
