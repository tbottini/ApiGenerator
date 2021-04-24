<template>
	<div>
		<client-only placeholder="Loading Your Editor...">
			<vue-editor
				id="editor"
				ref="input"
				v-model="textData"
				@focus="$emit('focus')"
			/>
		</client-only>
	</div>
</template>
<script>
export default {
	model: {
		prop: 'text',
		event: 'change'
	},
	props: {
		text: {
			type: String
		}
	},
	data() {
		return {
			textData: this.text
		}
	},
	watch: {
		textData(val) {
			this.$emit('change', val)
		}
	},
	methods: {
		focus() {
			//this.$refs.input.focus();
		},
		setText(val) {
			this.textData = val
		}
	}
}
</script>
