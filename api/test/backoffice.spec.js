const { Str, Int } = require('../srcs/attrs')
var Backoffice = require('../srcs/backoffice')

function newBackoffice() {
	return new Backoffice({
		name: 'test',
		attr: [new Str({ name: 'str' }), new Int({ name: 'int' })],
		uniqueKey: false,
		conf: {
			str: {
				namePrint: 'name'
			},
			int: {
				type: 'mozart'
			}
		},
		confTable: {
			namePrint: 'music'
		},
		relation: []
	})
}

describe('Backoffice Test', () => {
	var back = newBackoffice()
	const backofficeConf = back.generateBackofficeConf()

	test('Test namePrint Override', () => {
		const strAttr = backofficeConf.fields.attr[0]

		console.log(strAttr)
		expect(strAttr.namePrint).toBe('name')
	})

	test('Test Attr Override', () => {
		const intAttr = backofficeConf.fields.attr[1]

		console.log(intAttr)
		expect(intAttr.type).toBe('mozart')
	})

	test('Test Object', () => {
		expect({
			name: 'hello',
			world: '!'
		}).toMatchObject({
			name: 'hello',
			world: '!'
		})
	})
})
