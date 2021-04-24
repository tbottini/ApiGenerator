const Str = require('./attr/str'),
	File = require('./attr/file'),
	Boolean = require('./attr/boolean'),
	Int = require('./attr/int'),
	Anchor = require('./attr/anchor'),
	Date = require('./attr/date'),
	Index = require('./attr/index')

module.exports = {
	Str,
	File,
	Boolean,
	Int,
	Anchor,
	Date,
	Index,
	Password: require('./attr/password'),
	Float: require('./attr/float'),
	Enum: require('./attr/enum')
}
