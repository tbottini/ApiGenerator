<template>
	<div>
		<p><slot>Date</slot></p>
		<input
			ref="input"
			type="date"
			@input="onChangeDate"
			:value="adaptDate"
		/>
		<input type="time" @input="onChangeTime" :value="adaptTime" />
	</div>
</template>
<script>
import dateLib from '~/assets/dateLib'

export default {
	model: {
		prop: 'date',
		event: 'change'
	},
	props: {
		date: {
			type: Date,
			required: true
		}
	},
	data() {
		return {
			tmpDate: this.date
		}
	},
	methods: {
		onChangeDate(e) {
			const date = e.target.valueAsDate

			this.tmpDate.setDate(date.getDate())
			this.tmpDate.setMonth(date.getMonth())
			this.tmpDate.setFullYear(date.getFullYear())
			this.$emit('change', this.tmpDate)
		},
		onChangeTime(e) {
			const date = e.target.valueAsDate

			this.tmpDate.setHours(date.getHours() - 1)
			this.tmpDate.setMinutes(date.getMinutes())
			console.log(this.tmpDate, 'tmp')
			this.$emit('change', this.tmpDate)
		},
		focus() {
			this.$refs.input.focus()
		}
	},
	watch: {
		localDate() {
			this.$emit('change')
		},
		date(val) {
			console.log('tmp date changed', this.date)
			const date = val
			this.tmpDate.setDate(date.getDate())
			this.tmpDate.setMonth(date.getMonth())
			this.tmpDate.setFullYear(date.getFullYear())
			this.tmpDate.setHours(date.getHours())
			this.tmpDate.setMinutes(date.getMinutes())
			console.log('tmp date', this.tmpDate)
		}
	},
	computed: {
		adaptDate() {
			return dateLib.dayToString(this.date)
		},
		adaptTime() {
			return dateLib.timeToString(this.date)
		}
	}
}
</script>
<style scoped>
div {
	padding: 3px;
	margin-left: 10px;
}

p {
	font-size: 1.2em;
	display: inline;
	margin-right: 7px;
}

input {
	font-size: 1.2em;
	border: none;
	padding: 4px;
	padding-left: 10px;
	padding-right: 10px;
	transition: 0.6s;
	cursor: pointer;
}

input:hover,
input:focus {
	box-shadow: 1px 2px 3px 0px gray;
}
</style>
