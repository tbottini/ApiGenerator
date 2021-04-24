<template>
	<div class="defil">
		<div class="image-wrapper" v-for="(e, i) in imgs" :key="i">
			<img
				@click="select(i)"
				:src="'/api/_ipx/static/image/' + e.src"
				:class="{ image: true, active: idSelect == i }"
			/>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		imgs: {}
	},
	data() {
		return {
			idSelect: null
		}
	},
	methods: {
		select(index) {
			this.idSelect = index
			this.$emit('changeElem', this.imgs[index], index)
		}
	}
}
</script>

<style scoped>
.defil {
	height: 212px;
	overflow-x: scroll;
	overflow-y: hidden;
	display: flex;
	flex-direction: row;
}

.image-wrapper {
	height: 200px;
	min-width: 250px;
}

.active {
	border: 1px solid black;
}

.image {
	height: 100%;
	width: 100%;
	object-fit: cover;
	cursor: pointer;
}
</style>
