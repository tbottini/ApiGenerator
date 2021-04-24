<template>
	<div class="agenda">
		<div class="relative">
			<div
				class="size-100 absolute bg-color4 zindex-1"
				:class="{
					unvisible: eventsDaySelected.length == 0
				}"
			>
				<div class="relative">
					<label @click="eventsDaySelected = []">
						<icon
							class="absolute top-1 right-1 hov-color-5 size-1-5 hov-click"
							:icon="['fas', 'times']"
					/></label>
					<ul class="pt-6 pl-6">
						<nuxt-link
							v-for="(event, index) in eventsDaySelected"
							class="hov-color-5 fs-2 hov-click"
							:key="index"
							:to="event.path"
						>
							<label style="font-weight: 500"
								>{{ event.hour }}h{{
									event.minutes || ''
								}}
								/</label
							>{{ event.name }}
						</nuxt-link>
					</ul>
				</div>
			</div>
			<div class="grid relative">
				<div
					class="hidden-cell"
					v-for="i in indexDiffFirstDay"
					:key="i"
				/>
				<div
					class="wrapper-cell bg-color4-hover relative hov-click"
					v-for="(d, i) in days"
					:key="i + 1 + indexDiffFirstDay"
				>
					<AgendaCell
						:day="i + 1"
						:event="getEvents(i)"
						@click.native="eventsDaySelected = getEvents(i)"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		events: {
			type: Array,
			required: true
		},
		month: {
			type: Number,
			required: true
		},
		year: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			days: this.getMonthEvent(this.month, this.year),
			eventsDaySelected: []
		}
	},
	watch: {
		month(val) {
			this.days = this.getMonthEvent(val, this.year)
		}
	},
	methods: {
		getEvents(i) {
			return this.events.filter((e) => e.day == i + 1)
		},
		getDaysInMonth(month, year) {
			month -= 1
			var date = new Date(year, month, 1)
			var days = []
			while (date.getMonth() === month) {
				days.push(new Date(date))
				date.setDate(date.getDate() + 1)
			}
			return days
		},
		getDayIndex(day) {
			var i = day.getDay()
			if (!i) return 6
			else i - 1

			return !i ? 6 : i - 1
		},
		getMonthEvent(month, year) {
			var days = []
			days = this.getDaysInMonth(month, year)
			this.indexDiffFirstDay = this.getDayIndex(days[0])
			return days
		}
	}
}
</script>
<style lang="sass" scoped>
@import ~/assets/lichen.sass

.grid
  display: grid
  grid-template-columns: repeat(7, minmax(1rem, 1fr))
  grid-template-rows: repeat(5,9.5rem)
  grid-gap: 0px

.grid::before
  content: ''
  width: 0
  padding-bottom: 100%
  grid-row: 1 / 1
  grid-column: 1 / 1

.grid > *:first-child
  grid-row: 1 / 1
  grid-column: 1 / 1

/* Just to make the grid visible */

.grid > *
  background: white
  border: 1px $primary solid
  border: 1px solid $color1
  margin-top: -1px
  margin-left: -1px

.wrapper-cell
  position: relative
  overflow: auto

.hidden-cell
  visibility: hidden

.agenda
  margin: 0 auto

.bg-color4
  background-color: $color4
.bg-color4-hover:hover
  background-color: $color4
.size-100
  width: 100%
  height: 100%
.absolute
  position: absolute
.relative
  position: relative

.active-hover
  display: none
.active-hover:hover
  display: block

.active-parent:hover .active-hover
  display: block

.unvisible
  display: none

.zindex-1
  z-index: 1

.top-1
  top: 1rem
.right-1
  right: 1rem

.size-1-5
  height: 1.5rem
  width: 1.5rem
</style>
