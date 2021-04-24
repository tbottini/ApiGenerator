<script>
export default {
	//TODO transcript to JSX
	render(h) {
		console.log(this.attr, this.xtitle)

		var cells = []
		if (this.xtitle) {
			this.xtitle.forEach((val, i) => {
				cells.push(
					h('div', {
						domProps: {
							innerHTML: val.namePrint
						},
						class: {
							xtitle: true
						},
						key: i
					})
				)
			})

			if (this.data && !this.data.error) {
				/* if (typeof this.data == "object")
                    this.data = [this.data];*/
				if (this.data.constructor !== Array) this.data = [this.data]
				this.sortElements.forEach((val, j) => {
					for (var i = 0; i < this.xtitle.length; i++) {
						cells.push(
							h(
								'div',
								{
									class: {
										selected: val['id'] == this.idSelect,
										cell: true
									},
									on: {
										click: (e) => {
											this.idSelect = val['id']
											//val.index = j;
											this.$emit('changeElem', val)
										}
									}
								},
								[
									h('p', {
										domProps: {
											innerHTML: val[this.xtitle[i].name]
										},
										class: {
											'cell-paragraph': true
										}
									})
								]
							)
						)
					}
				})
			}
		}

		var styleTable = this.xtitle
			? {
					'grid-template-columns': `repeat(${
						this.xtitle.length
					}, ${'1'}fr)`
			  }
			: {}

		return h(
			'div',
			{
				class: {
					table: true
				},
				style: styleTable
			},
			cells.concat([
				h('div', [
					h(
						'div',
						{
							class: {
								actions: true
							}
						},
						[
							/*h('button', 'delete'),
                            h('button', 'create')*/
						]
					)
				])
			])
		)
	},
	mounted() {
		this.get()
	},
	data() {
		console.log(this.xtitle)
		return {
			data: null,
			idSelect: null
		}
	},
	props: {
		regex: {
			type: RegExp,
			require: true
		},
		url: {
			type: String,
			default: '/users/'
		},
		xtitle: {
			type: Array,
			required: false
		},
		id: {},
		uniqueKey: {
			type: Boolean,
			default: false
		},
		sort: {}
	},
	methods: {
		get() {
			this.$axios.get('/api' + this.url).then((r) => {
				this.data = r.data
			})
		},
		select(id) {
			this.idSelect = id
			this.$emit('changeElem', this.data[id])
		},
		addElem(elem) {
			this.data.push(elem)
		},

		//
		getElem(i) {
			return this.sortElements[i]
		},
		getMaxItems() {
			return this.sortElements.length
		},
		setElement(index, attr, value) {
			this.sortElements[index][attr] = value
		}
	},
	computed: {
		// Sort Row by the regex provided
		sortElements() {
			const xtitleFilter = this.xtitle[0]?.name

			var regexElem
			if (!xtitleFilter) regexElem = this.data
			else
				regexElem = this.data.filter((entry) =>
					this.regex.test(entry[this.xtitle[0].name])
				)

			if (!this.sort) {
				var elements = regexElem.sort((a, b) => a.id < b.id)
			} else {
				console.log(this.sort)
				var elements = regexElem.sort(
					(a, b) => a[this.sort.attr] - b[this.sort.attr]
				)

				if (this.sort.reverse) elements = elements.reverse()
			}

			return elements.map((p, i) => {
				return {
					...p,
					i
				}
			})
		}
	}
}
</script>
<style lang="sass" scoped>
@import ~/assets/manage

.table
  display: grid
  max-height: 70vh
  overflow: auto

.selected
  background-color: $bgcolor-active !important
  color: $color-active !important

.xtitle
  background-color: $bgcolor-active
  color: white
  text-transform: uppercase
  font-size: 1.2em
  padding: 4px

.cell-paragraph
  margin: 4px
  margin-bottom: 10px
  font-size: 1.2em
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 4; /* number of lines to show */
  -webkit-box-orient: vertical
  color: inherit

.cell
  word-wrap: anywhere
  cursor: pointer
  background-color: white
  color: $color
  min-height: 2rem

  &:hover
    background-color: $bgcolor-hover
</style>
