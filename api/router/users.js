const router = require('express').Router()
var userController = require('../controller/users22.js')
var User = require('../model/users.js')
const ERROR = require('../srcs/error')
const parse = require('../srcs/parser.js')
var images = require('../srcs/images.js')
var file = require('../srcs/file.js')
const upload = file.upload

const ATTR_UPDATE = ['email']

router
	.post('/login', async (req, res) => {
		var { email, password } = parse.entitiesObject(req.body)
		if (!email || !password) return res.json(ERROR.uncomplete)
		var user = await userController.auth(email, password)
		req.session.is_admin = user.isadmin
		req.session.id_user = user.id
		return res.json(user)
	})
	.post('/create', async (req, res) => {
		var params = parse.entitiesObject(req.body)
		if (!params.email || !params.password)
			return res.json({ error: 'no mail or password provide' })

		if (!parse.checkMail(params.email)) return res.json(ERROR.formatemail)
		if (!parse.checkPassword(req.body.password))
			return res.json(ERROR.formatpassword)

		var newUser = await userController.createUser(newUser)
		return res.json(newUser)
	})
	.post('/removeUser/', async (req, res) => {
		if (!req.body.id) return res.json(ERROR.uncomplete)
		if (!req.session.is_admin) return res.json(ERROR.adminRight)
		var idDelete = parse.secureSql(req.body.id)
		var ret = await userController.delete(idDelete)
		return res.json({ msg: 'user delete' })
	})
	.post('/changePassword', async (req, res) => {
		if (!req.session.id_user) return res.json(ERROR.unlog)
		if (!req.body.oldPassword || !req.body.newPassword)
			return res.json(ERROR.uncomplete)
		if (!parse.checkPassword(req.body.newPassword))
			return res.json(ERROR.formatpassword)
		var params = parse.entitiesObject(req.body)
		var status = await userController.changePassword(
			req.session.id_user,
			params.oldPassword,
			params.newPassword
		)
		return res.json(status)
	})
	.post('/set', upload.single('value'), async (req, res) => {
		var params = parse.entitiesObject(req.body)
		console.log(req.body)
		if (!req.session.id_user) return res.json(ERROR.unlog)
		if (!params.attr || (!params.value && params.attr != 'srcIcon'))
			return res.json(ERROR.uncomplete)
		if (
			!ATTR_UPDATE.includes(params.attr) //if they are attributes who can be update
		)
			return res.json(ERROR.attrRight)

		if (params.attr == 'srcIcon' && !req.file)
			return res.json(ERROR.fileMissing)
		else if (params.attr == 'srcIcon')
			params.value = await images.save(req.file.buffer)

		var status = await userController.update(
			req.session.id_user,
			params.attr,
			params.value
		)
		return res.json(status)
	})
	.post('/set/:id', upload.single('value'), async (req, res) => {
		var params = parse.entitiesObject(req.body)
		console.log(req.body)
		if (!req.session.is_admin) return res.json(ERROR.adminRight)
		if (!req.params.id) return res.json(ERROR.uncomplete)
		if (!params.attr || (!params.value && params.attr != 'srcIcon'))
			return res.json(ERROR.uncomplete)
		if (
			!ATTR_UPDATE.includes(params.attr) // if they are attribute who can be update
		)
			return res.json(ERROR.attrRight)
		if (params.attr == 'srcIcon' && !req.file)
			return res.json(ERROR.fileMissing)
		else if (params.attr == 'srcIcon')
			params.value = await images.save(req.file.buffer)
		var id = parse.secureSql(req.params.id)
		var status = await userController.changeAttr(
			id,
			params.attr,
			params.value
		)
		return res.json(status)
	})

	.get('/', async (req, res) => {
		if (!req.session.is_admin) return res.json(ERROR.adminRight)
		return res.json(await userController.getUsers())
	})
	.get('/self', async (req, res) => {
		if (!req.session.id_user) return res.json(ERROR.unlog)
		return res.json(await userController.get(req.session.id_user))
	})
	.get('/logout', async (req, res) => {
		req.session.id_user = null
		req.session.is_admin = null

		res.json({ msg: 'user logout' })
	})
	.get('/:id', async (req, res) => {
		if (!req.session.is_admin) return res.json(ERROR.adminRight)
		var id_user = parse.secureSql(req.params.id)
		return res.json(await userController.get(id_user))
	})

module.exports = router
