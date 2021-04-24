<template>
	<div ref="grid">
		<div :class="grid">
			<div v-for="e in elementsFilter" :key="e.id">
				<slot v-bind:cell="e">
					<nuxt-link :to="e.path || '/'">
						<figure class="image is-4by5">
							<img
								class="img"
								sizes="sm:100vw md:50vw lg:290px"
								:src="e.src"
							/>
						</figure>
					</nuxt-link>
				</slot>
			</div>
		</div>
		<div @click="extend" class="has-text-centered is-size-5 extend">
			<p class="clickable" v-show="sizeElements < elements.length">
				Voir la suite
			</p>
		</div>
	</div>
</template>
<script>
import Img from './Img.vue'
export default {
	components: { Img },
	props: {
		elements: {
			type: Array,
			required: true
		},
		maxItems: {
			type: Number,
			required: false
		},
		linkMore: {
			type: String,
			required: false
		},
		grid: {
			default: 'grid'
		},
		widthElement: {
			type: Number,
			required: false
		},
		rowStackSize: {
			type: Number,
			default: 4
		},
		initPageOpen: {
			type: Number,
			default: 1
		}
	},
	mounted() {},

	data() {
		return {
			widthComp: 0,
			rowStackNumber: this.initPageOpen
		}
	},
	methods: {
		extend() {
			this.rowStackNumber++
			if (
				this.elements.length <
				this.rowStackNumber * this.rowStackSize * 6
			) {
				this.$emit('extend')
			}
		}
	},
	watch: {},
	computed: {
		elementsFilter() {
			return this.elements.slice(0, this.sizeElements)
		},
		sizeElements() {
			return 6 * this.rowStackSize * this.rowStackNumber
		}
	}
}
</script>
<style lang="sass">
@import '~/assets/main.sass'
@import '~/assets/lichen'

.clickable:hover
  color: $color1

.img-1by3
  padding-top: calc(100% * (3 / 1))
  position: relative

.extend
  cursor: pointer
.extend:hover
  color: $primary
</style>
