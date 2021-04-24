<template>
	<div class="inputSetter">
		<p id="title" class="pres">
			{{ query.namePrint }}
		</p>
		<select :value="init" @input="edit">
			<option v-for="(o, i) in options" :key="i">{{ o }}</option>
		</select>
	</div>
</template>
<script>
import apiHandler from '~/assets/class/apiHandler'

export default {
	props: {
		init: {},
		query: {}
	},
	data() {
		return {
			value: this.init,
			vChanged: null,
			options: ['auteur', 'traducteur', 'artiste'],
			modeEdition: false
		}
	},
	methods: {
		edit(val) {
			console.log('CHANGED ##############', val.target.value)

			apiHandler.setAttr(this.query, val.target.value).then((msg) => {
				msg = msg.data
				if (!msg.error) {
					this.$emit('update', msg)

					msg.msg = 'Édition effectuée'
				}
				this.$store.commit('setMsgApi', msg)
			})
		}
	},
	watch: {
		init(val) {
			console.log('init CHANGED', val)
			this.value = val
		}
	}
}
</script>
<style lang="sass" scoped>
@import ~/assets/manage
</style>
