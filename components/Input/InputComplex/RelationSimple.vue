<template>
	<div class="inputSetter">
		<p id="title" class="pres">
			{{ query.namePrint }}
		</p>
		<p class="choosen">
			<label v-for="(elem, i) in tagElements" :key="i">
				{{ elem.name }}
				<icon
					@click="untag(elem)"
					class="icon-delete"
					:icon="['fas', 'times']"
				/>
			</label>
		</p>
		<ListSelection class="list" @select="active" :items="items" />
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
			post: this.query.extra.talbe_link,
			...this.query.extra
		}
	},
	watch: {
		query(old, newVal) {
			if (old.id != newVal.id) this.find()
			console.log('query changed', old, newVal)
		}
	},
	methods: {
		async find() {
			const {
				table_get,
				link_attr,
				print_property,
				link
			} = this.query.extra

			var get = table_get

			var values = [],
				relElements = []

			var values = await this.$axios.get('/api/' + get)
			var valuesLink = values.data.map((value) => {
				var active = value[link_attr] == this.query.id
				var item = {
					name: value[print_property],
					active: active,
					id: value['id']
				}
				if (active) relElements.push(item)
				return item
			})

			this.items = valuesLink
			this.chooseElements = relElements
		},
		confirm() {},
		untag(elem) {
			var index = this.items.findIndex((item) => item.id == elem.id)
			this.active(index)
		},
		active(index) {
			var item = this.items[index]
			item.active = !item.active
			var value = item.active ? this.query.id : null
			apiHandler.set(this.table_get, item.id, this.link_attr, value)
			this.items.slice(index, 1)
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
@import ~/assets/manage

.choosen *
  background-color:  #FFF5E6
  margin: 2px
  font-size: 1.2rem

.list
  font-size: 1.3rem

.choosen
  margin-bottom: 1rem

.icon-delete
  width: 18px;
  height: 18px
  border-radius: 100%
  border: 1px solid black
  padding: 3px
  cursor: pointer;

.icon-delete:hover
  color:  #FFF5E6
  background-color: black
</style>
