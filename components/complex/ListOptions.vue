<template>
		<label style="position: relative; display: inline-block; bakcground-color: white;">
			<ToggleButtonState v-model="listOptionShow"><icon :icon="['fas', 'list']" /></ToggleButtonState>
			<ol @click.prevent class="modal" v-show="!listOptionShow">
				<li :class="classLi(o)" @click="active(o, i)" v-for="(o, i) in opt" :key="i">
					{{o.name}} 
				</li>
			</ol>
		</label>
</template>
<script>
export default {
	props: {
		list: {
			type: Array,
			required: true,
		}
	},
	data() {
		return {
			opt: this.list,
			listOptionShow: true,
		}
	},
	methods: {
		classLi(li) {
			return {
				activeList: li.active
			}
		},
		active(list, index)
		{
			list.active = !list.active;
			this.$emit('updateList', list.active, index);
		}
	}
}
</script>
<style scoped>

.modal
{
	position: absolute;
	border: 2px solid black;
	padding-top: 10px;
	padding-bottom: 10px;
	padding-left: 0;
	border-radius: 5px;
	background-color: white;
	z-index: 10;
}

.activeList
{
	color: white;
	background-color: black;
}

li
{
	list-style: none;
	padding: 7px;
}


</style>