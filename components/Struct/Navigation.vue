<template>
	<div class="columns is-mobile pt-5" id="nav-header">
		<nuxt-link
			style="padding: 0.75rem 0 !important"
			class="column is-one-fifth"
			to="/"
			><slot></slot
		></nuxt-link>
		<MenuHori class="column" :dirs="dirs"></MenuHori>
	</div>
</template>
<script>
export default {
	props: {
		dirs: {
			type: Array,
			required: true
		}
	}
}
</script>
<style scoped></style>
