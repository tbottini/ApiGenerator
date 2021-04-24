<template>
	<Button @click.native="$emit('click')">
		<icon class="icon" :icon="['fas', icon]" />
	</Button>
</template>
<script>
export default {
	props: {
		icon: {
			type: String,
			required: true
		},
		color: {
			type: String,
			default: 'black'
		}
	}
}
</script>
