<template>
	<img :query="query" @change="updateElem" :edit="true" :src="url" />
</template>
<script>
export default {
	props: {
		query: {
			type: Object,
			required: true
		},
		src: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			url: this.src
		}
	},
	methods: {
		updateElem(elem) {
			this.url = elem
		}
	}
}
</script>
