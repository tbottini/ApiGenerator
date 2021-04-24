<template>
	<div>
		<Button v-if="!modeEdition" @click.native="edit"
			><icon :icon="['fas', 'edit']"
		/></Button>
		<div v-if="modeEdition">
			<Button @click.native="confirm"
				><icon :icon="['fas', 'check']"
			/></Button>
			<Button @click.native="reset"
				><icon :icon="['fas', 'retweet']"
			/></Button>
		</div>
	</div>
</template>
<script>
export default {
	model: {
		prop: 'modeEdition',
		event: 'change'
	},
	props: {
		modeEdition: {}
	},
	methods: {
		edit() {
			this.$emit('change', true)
			this.$emit('edit')
		},
		reset() {
			this.$emit('change', false)
			this.$emit('reset')
		},
		confirm() {
			this.$emit('change', false)
			this.$emit('confirm')
		}
	}
}
</script>
