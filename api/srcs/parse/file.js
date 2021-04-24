const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const FileType = require('file-type')
const fs = require('fs')

const upload = multer({
	limits: {
		fileSize: 4 * 1024 * 1024 * 1024
	}
})

function save(buffer, subpath = '', extension = '') {
	const filename = uuidv4() + '.' + extension
	const filepath = './static/' + subpath + filename
	fs.writeFileSync(filepath, buffer)
	return filename
}

module.exports = {
	upload,
	save,
	FileType
}
