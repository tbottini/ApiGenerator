<template>
	<div class="inputSetter">
		<p id="title" class="pres">
			{{ query.namePrint }}
		</p>
		Choisi: {{ value }}<br />
		<select @input="edit" :selectedIndex="-1">
			<option :key="-1">choisissez un élément</option>
			<option v-for="(o, i) in elem" :key="i">{{ o.name }}</option>
		</select>
	</div>
</template>
<script>
import apiHandler from '~/assets/class/apiHandler'

export default {
	props: {
		query: {},
		init: {},
		elements: {}
	},
	data() {
		console.log(this.init, 'init')
		return {
			value: this.init,
			elem: []
		}
	},
	watch: {
		init(val) {
			console.log('init CHANGED', val)
			this.value = val
		}
	},
	methods: {
		edit(val) {
			console.log('CHANGED ##############', val.target.value)

			this.value = val.target.value

			apiHandler.setAttr(this.query, val.target.value).then((msg) => {
				msg = msg.data
				if (!msg.error) {
					this.$emit('update', msg)

					msg.msg = 'Édition effectuée'
				}
				this.$store.commit('setMsgApi', msg)
			})
		},
		setElements(val) {
			this.elem = val
		}
	}
}
</script>
<style lang="sass" scoped>
@import ~/assets/manage
</style>
