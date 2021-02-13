<template>
	<Button @click.native="$emit('click')">
		<icon :style="'color: ' + color" :icon="['fas', icon]" />
	</Button>
</template>
<script>
export default {
	props: {
		icon: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: "black"
		}
	}
}
</script>