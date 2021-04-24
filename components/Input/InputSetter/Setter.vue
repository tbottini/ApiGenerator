<template>
	<div class="inputSetter">
		<p id="title" class="pres relative">
			{{ query.namePrint }}
			<template v-if="query.help">
				<label
					class="zone"
					@mouseover="infoBulleOpen = true"
					@mouseleave="infoBulleOpen = false"
				>
					<icon :icon="['fas', 'question-circle']" />
					<label class="zone">
						<label class="info-bulle" v-if="infoBulleOpen">
							{{ query.help }}
						</label>
					</label>
				</label>
			</template>
		</p>
		<slot></slot>
		<div id="btns">
			<SetterButtons
				v-model="modeEdition"
				@edit="edit()"
				@confirm="confirm()"
				@reset="reset()"
			/>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		query: {}
	},
	data() {
		return {
			saveSrc: null,
			modeEdition: false,
			file: null,
			infoBulleOpen: false
		}
	},
	methods: {
		edit() {
			this.$emit('edit')
		},
		confirm() {
			this.$emit('confirm')
		},
		reset() {
			this.$emit('reset')
		},
		remove() {
			this.$emit('remove')
		},
		modeEditionSet(val) {
			this.modeEdition = val
		}
	}
}
</script>
<style lang="sass" scoped>
@import ~/assets/manage

#btns
    display: flex;
    flex-direction: row;

.relative
    position: relative;

.info-bulle
    position: absolute;
    background-color: white;
    color: black;
    border-radius: 3px;
    border: 2px solid black;
    padding: 13px;
    top: 50%;
    margin-left: 10px;
    max-width: 40%;
    font-size: 0.8em;
    text-transform: none;

.zone
    padding-right: 20px;
</style>
