<template>
	<div>
		<p ref="paragraph" :class="{ 'p-mobile': $mq == 'mobile' }">
			{{ text }}
		</p>
	</div>
</template>
<script>
export default {
	props: {
		attr: {
			type: String
		},
		urlAction: {
			type: String
		},
		text: {
			type: String
		}
	}
}
</script>
<style scoped>
p {
	font-size: 1.3em;
	margin-top: 0;
	overflow-wrap: anywhere;
	margin-bottom: 6px;
}

.p-mobile {
	font-size: 4vw;
}
</style>
