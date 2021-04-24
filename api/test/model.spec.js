const Model = require('../srcs/model')
const { Str } = require('../srcs/attrs')

describe('Model Test', () => {
	/**
	 * we test if the model return all the necessary material request
	 */
	test('creation model', () => {})

	test('bad syntax of name model', () => {
		const t = () => {
			new Model({
				name: 'tes-hello',
				attr: [new Str({ name: 'pana' })]
			})
		}
		expect(t).toThrow()
	})

	test('bad syntax of name attributes', () => {
		const t = () => {
			new Model({
				name: 'test',
				attr: [new Str({ name: 'pane-na' })]
			})
		}
		expect(t).toThrow()
	})

	test('bad syntax maj of name attribute', () => {
		var t = () => {
			new Model({
				name: 'TEST',
				attr: [new Str({ name: 'pane' })]
			})
		}
		expect(t).toThrow()

		t = () => {
			new Model({
				name: 'test',
				attr: [new Str({ name: 'BADNAME' })]
			})
		}
		expect(t).toThrow()

		t = () => {
			new Model({
				name: 'test',
				attr: [new Str({ name: 'correct' })]
			})
		}
		expect(t).not.toThrow()
	})

	test('Model architecture', () => {
		var m = new Model({
			name: 'test',
			attr: [new Str({ name: 'test_str' })]
		})
		expect(m).toMatchObject({
			name: 'test',
			attr: [
				{
					name: 'test_str'
				}
			]
		})
	})
})
