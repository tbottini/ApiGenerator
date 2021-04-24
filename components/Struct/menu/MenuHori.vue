<template>
	<nav class="navigation-menuhori">
		<ul class="menuHori" :style="menuHoriTemplate">
			<li
				class="menu-items is-size-5-desktop is-size-6-tablet"
				v-for="(direction, index) in dirs"
				:key="index + direction.path"
			>
				<div class="dir-child">
					<label
						:style="
							'text-align: ' +
							(index == dirs.length - 1 ? 'right' : 'left')
						"
						@click="onClickNavigation(direction.path)"
					>
						<nuxt-link
							class="menu-items color-2"
							:to="direction.path"
							:title="direction.name"
							v-if="!direction.brut"
							>{{ direction.name }}</nuxt-link
						>
						<a
							v-else
							class="menu-items color-2"
							:href="direction.path"
							:title="direction.name"
							target="_blank"
							>{{ direction.name }}</a
						>
						<ul v-if="direction.subdir.length" class="subdir-child">
							<li
								v-for="sdir in direction.subdir"
								:key="sdir.path"
							>
								<nuxt-link v-if="!sdir.brut" :to="sdir.path">
									{{ sdir.name }}
								</nuxt-link>
								<a v-else :href="sdir.path" target="_blank">{{
									sdir.name
								}}</a>
							</li>
						</ul>
					</label>
				</div>
			</li>
		</ul>
	</nav>
</template>
<script>
export default {
	model: {
		prop: 'active',
		event: 'change'
	},
	props: {
		dirs: {
			type: Array,
			required: true
		},
		home: {
			type: String,
			default: '/'
		},
		active: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			menuVisible: false
		}
	},
	computed: {
		menuHoriTemplate() {
			return (
				'grid-template-columns: repeat(' + this.dirs.length + ', 1fr);'
			)
		}
	},
	methods: {
		capitalize(str) {
			return str.replace(/\b\w/g, (l) => l.toUpperCase())
		},
		itemColor(color) {
			return {
				color: color,
				'text-decoration-color': color
			}
		},
		onClickNavigation(path) {
			this.$nuxt.$emit('menuEvent', { type: path })
		}
	}
}
</script>
<style lang="sass" scoped>
@import '~/assets/main.sass'
@import '~/assets/lichen.sass'

.navigation-menuhori
  margin: 0
  padding: 0

a
  color: black
  white-space: nowrap
  font-family: $font !important

.menuHori
  display: grid

  width: 100%
  min-width: 100%

.menu-items
  position: relative
  flex: 1
  padding: 0
  margin: 0

.menu-items:hover
  bacground-color: none
  font-family: "GrotesqueBold" !important

.menu-items::after
  display: block
  content: attr(title)
  font-family: "GrotesqueBold"
  height: 1px
  color: transparent
  overflow: hidden
  visibility: hidden

.subdir-child
  position: absolute
  top: 100%
  left: 0
  z-index: 2
  display: none
  background-color: #fffc
  color: $primary
  margin: 0
  padding: 0

.subdir-child:hover
  background-color: #fffd

.subdir-child li
  color: $primary
  white-space: nowrap
  padding: 7px
  border-bottom: 1px solid $primary

.subdir-child li a
  color: $primary

.subdir-child li a:hover, .subdir-child li:hover
  font-family: "GrotesqueBold"
  color: $primary

.subdir-child li:hover
  font-weight: bold
  font-family: "GrotesqueBold"

.dir-child label:hover > .subdir-child
  display: block

.dir-child label
  position: relative
  padding: 0.5rem 0
  display: block
  width: min-content
  margin-left: auto

nav
  display: block
</style>
