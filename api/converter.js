var Post = require('./srcs/postgresql')
var post = new Post({ database: 'test' })
var Lite = require('./srcs/sqlite')
var lite = new Lite({})

async function main() {
	var p = await lite.all('select * from poem')

	post.insertMultiple([
		{
			name: 'poem',
			object: p
		}
	])
}

main()
