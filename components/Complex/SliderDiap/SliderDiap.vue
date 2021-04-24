<template>
	<div :class="sliderClass">
		<template v-if="!fullscreen">
			<div
				v-if="btnsActive"
				@mouseover="btnsActive = true"
				@mouseleave="btnsActive = false"
				@click="prev"
				:class="'btns left'"
			>
				<icon :class="'svg-' + $mq" :icon="['fas', 'chevron-left']" />
			</div>
			<div
				v-if="btnsActive"
				@mouseover="btnsActive = true"
				@mouseleave="btnsActive = false"
				@click="next"
				:class="'btns right'"
			>
				<icon :class="'svg-' + $mq" :icon="['fas', 'chevron-right']" />
			</div>
			<div
				v-if="btnsActive"
				@mouseover="btnsActive = true"
				@mouseleave="btnsActive = false"
				@click="setFullscreen(true)"
				:class="'btns right-bottom'"
			>
				<icon
					:class="'svg-' + $mq"
					:icon="['fas', fullscreen ? 'compress' : 'expand']"
				/>
			</div>
			<div style="min-width: 100%; min-height: 100%">
				<transition name="fade" mode="out-in">
					<div @click="next" :key="currentNumber">
						<img
							@mouseover="btnsActive = true"
							@mouseleave="btnsActive = false"
							:src="currentImage"
							v-on:mouseover="stopRotation"
							v-on:mouseout="startRotation"
						/>
					</div>
				</transition>
			</div>
		</template>
		<div class="fullscreen" v-else>
			<div
				style="
					position: fixed;
					bottom: 4%;
					display: flex;
					flex-direction: row;
					color: white;
					width: 100%;
					justify-content: center; ;
				"
			>
				<icon
					:class="'svgf-' + $mq"
					@click="prev"
					:icon="['fas', 'chevron-left']"
				/>
				<icon
					:class="'svgf-' + $mq"
					@click="setFullscreen(false)"
					:icon="['fas', 'compress']"
				/>
				<icon
					:class="'svgf-' + $mq"
					@click="next"
					:icon="['fas', 'chevron-right']"
				/>
			</div>

			<div style="min-width: 100%; min-height: 60%; max-height: 80%">
				<div @click="next" :key="currentNumber">
					<img
						:src="currentImage"
						class="img-fullscreen"
						v-on:mouseover="stopRotation"
						v-on:mouseout="startRotation"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			currentNumber: 0,
			timer: null,
			delay: 100000,
			canRotate: false,
			fullscreen: false,
			btnsActive: false
		}
	},

	mounted() {
		this.startRotation()
	},

	props: {
		slide: {}
	},
	watch: {
		fullscreen(value) {
			this.$emit('fullscreen', value)
		}
	},

	methods: {
		startRotation() {
			this.timer = setTimeout(this.next, this.delay)
		},

		stopRotation() {
			clearTimeout(this.timer)
			this.timer = null
		},

		next() {
			if (this.slide.length > 1) {
				clearTimeout(this.timer)
				this.startRotation()
				this.currentNumber += 1
			}
		},
		prev() {
			if (this.slide.length > 1) {
				clearTimeout(this.timer)
				this.startRotation()

				this.currentNumber -= 1
			}
		},
		setFullscreen(val) {
			this.fullscreen = val
			console.log('show')
			this.$store.commit('menuPrint', !val)
		}
	},
	beforeDestroy() {
		this.$store.state.logoShow = true
	},

	computed: {
		currentImage: function () {
			return (
				'/api/static/api/_ipx/static/image/' +
				this.slide[Math.abs(this.currentNumber) % this.slide.length]
					.path
			)
		},
		sliderClass() {
			return {
				diapo: !this.fullscreen,
				'diapo-fullscreen': this.fullscreen
			}
		}
	}
}
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}

.diapo {
	position: relative;
}

.diapo-fullscreen {
	width: 100%;
	left: 0;
	min-height: 100vh;
	align-items: center;
	display: flex;
	justify-content: center;
	top: 5%;
	background-color: black;
}

img {
	object-fit: contain;
	width: 100%;
	min-width: 100%;
	cursor: pointer;
	max-height: 100vh;
}

.slider-diap {
	position: relative;
}

a {
	color: white;
}

.btns {
	position: absolute;
	cursor: pointer;
	color: white;
}

.btns-fullscreen {
	position: fixed;
	color: white;
	bottom: 0;
}

.left,
.right {
	top: 45%;
}

.left {
	left: 0;
}
.right {
	right: 0;
}
.right-bottom {
	bottom: 10px;
	right: 10px;
	color: white;
}

.svg-desktop {
	width: 30px;
	height: 30px;
	margin: 5px;
}

.svg-mobile {
	width: 4vw;
	height: 4vw;
	margin: 6px;
}

.svgf,
.svgf-desktop {
	width: 40px;
	height: 40px;
	margin: 10px;
	cursor: pointer;
}
.svgf-mobile {
	width: 8vw;
	height: 8vw;
	margin: 10vw;
	cursor: pointer;
}
.img-fullscreen {
	width: 100%;
	height: 100%;
	max-height: 100vh;
	max-width: 100%;
	object-fit: contain;
}
</style>
