<template>
	<div class="inputSetter">
		<p id="title" class="pres">
			{{ query.namePrint }}
		</p>
		<TagList :elements="tagElements" @untag="untag" />
		<ListSelection @select="select" :items="items" />
	</div>
</template>
<script>
import apiHandler from '~/assets/class/apiHandler'

export default {
	props: {
		query: {
			required: true
		}
	},
	data() {
		this.find()

		return {
			items: [],
			chooseElements: [],
			links: [],
			post: this.query.extra.table_link,
			...this.query.extra
		}
	},
	watch: {
		query(old, neww) {
			if (old.id != neww.id) this.find()
		}
	},
	methods: {
		findSimple() {
			this.$axios.get('/api/' + get).then((r) => {
				r = r.data
			})
		},
		//get all information for update and select relations
		find() {
			const {
				table_get,
				table_link,
				link_attr,
				print_property,
				search_attr,
				link
			} = this.query.extra

			var post = table_link,
				get = table_get

			var promiseLink = this.$axios.get(
				'/api/' + post + '?' + link_attr + '=' + this.query.id
			)
			var promiseGet = this.$axios.get('/api/' + get)

			var values = [],
				links = [],
				relElements = []

			Promise.all([promiseLink, promiseGet]).then((values) => {
				var [linksValue, getValue] = values

				links = linksValue.data

				//connect values
				values = getValue.data.map((val) => {
					var active = links.find(
						(link) => val.id == link[search_attr]
					)
					var item = {
						name: val[print_property],
						active: active,
						id: val['id']
					}

					if (active) relElements.push(item)

					return item
				})

				this.links = links
				this.items = values
				this.chooseElements = relElements
				this.$emit('up', this.tagElements)
			})
		},
		confirm() {},
		untag(elem) {
			this.active(elem)
		},
		select(index) {
			this.active(this.items[index])
		},
		active(item) {
			item.active = !item.active
			if (item.active) {
				var form = {}
				form[this.link_attr] = this.query.id
				form[this.search_attr] = item.id

				apiHandler
					.postStandard('/api/' + this.post + '/post', form)
					.then((r) => {
						console.log(r.data)
						this.links.push(r.data)
					})
			} else {
				//get id links
				var link = this.links.findIndex(
					(l) =>
						l[this.search_attr] == item.id &&
						l[this.link_attr] == this.query.id
				)
				console.log(link)
				if (link === 'undefined')
					return console.error('no active link find')
				var id = this.links[link].id
				this.links.splice(link, 1)
				this.$axios.get('/api/' + this.post + '/del/' + id)
			}
			this.$emit('up', this.tagElements)
		},
		remove(index) {}
	},
	computed: {
		tagElements() {
			return this.items.filter((i) => i.active)
		}
	}
}
</script>
<style lang="sass" scoped>
@import ~/assets/setter
</style>
