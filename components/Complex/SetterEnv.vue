<template>
	<div style="margin: 0" v-if="elem">
		<div v-for="(attr, index) in fields" :key="attr.id + '-' + index">
			<InputSetter
				v-if="attr.type == 'string'"
				@update="updateElem"
				:query="query(attr)"
				:init="elem[attr.name]"
			/>
			<DateSetter
				v-else-if="attr.type == 'date'"
				@update="updateElem"
				:date="elem[attr.name]"
				:query="query(attr)"
				:init="elem[attr.name]"
			/>
			<ImgSetter
				v-else-if="attr.type == 'image'"
				:query="query(attr)"
				@update="updateElem"
				:edit="true"
				:src="'/' + elem[attr.name]"
			/>
			<FileSetter
				v-else-if="attr.type == 'file'"
				:query="query(attr)"
				@update="updateElem"
				:edit="true"
				:src="elem[attr.name]"
			/>
			<PasswordSetter v-else-if="attr.type == 'password'" />
			<BooleanSetter
				v-else-if="attr.type == 'boolean'"
				:query="query(attr)"
				@update="updateElem"
				:init="elem[attr.name]"
			/>

			<AnchorSetter
				v-else-if="attr.type == 'anchor'"
				:query="query(attr)"
				@update="updateElem"
				:init="elem[attr.name]"
			/>

			<DiapoSetter
				v-else-if="attr.type == 'diapo'"
				:id_project="elem.id"
			/>

			<IntSetter
				v-else-if="attr.type == 'int' || attr.type == 'float'"
				@update="updateElem"
				:query="query(attr)"
				:init="elem[attr.name]"
			/>

			<EnumSetter
				v-else-if="attr.type == 'enum'"
				@update="updateElem"
				:query="query(attr)"
				:init="elem[attr.name]"
			/>
			<RelationSimple
				:key="attr.id + '-relationSimple-' + index"
				v-else-if="attr.type == 'relation-simple'"
				:query="query(attr)"
			/>
			<RelationSetter
				v-else-if="attr.type == 'relation-inter'"
				@up="up(attr.name, $event)"
				:query="query(attr)"
			/>
			<RelationImage
				v-else-if="attr.type == 'relation-image'"
				:query="query(attr)"
			/>
			<RelationEnum
				v-else-if="attr.type == 'relation-enum'"
				:query="query(attr)"
			/>
			<div v-else-if="attr.type == 'index'" />
			<RefAuthor
				ref="reference_authors"
				key="123451532"
				v-else-if="attr.type == 'id_ref_author'"
				:query="query(attr)"
				:init="elem[attr.name]"
				:elements="d.references.poet"
			/>

			<div v-else>error</div>
		</div>
	</div>
</template>
<script>
//passage à du rendu jsx

export default {
	name: 'SetterEnv',
	model: {
		prop: 'elem',
		event: 'updateElem'
	},
	props: {
		url: {},
		fields: {},
		uniqueEntry: {
			//exemple config table have unique entry
			type: Boolean,
			default: false
		},
		elem: {
			type: Object,
			required: false
		}
	},
	data() {
		console.log('setter env active')
		return {
			inputs: this.fields,
			test: false,
			d: {
				references: { poet: [], traductor: [] }
			}
		}
	},

	watch: {
		elem() {
			console.log('SetterEnv id changed', this.elem.id)
		}
	},
	methods: {
		updateElem(elem) {
			//update the elem with id 1
			console.log('SetterEnv update elem: ', elem)
			Object.keys(elem).forEach((key) => {
				this.elem[key] = elem[key]
			})
			this.$emit('updateElem', this.elem)
		},
		up(variableName, value) {
			console.log('update realtion', value)

			var test = value.map((v) => v.id)
			console.log(test)
			this.d.references[variableName] = value //test;
			console.log(this.$refs.reference_authors)
			if (variableName == 'poet')
				this.$refs.reference_authors[0].setElements(value)
			/*this.avoid = value.map(v => {
        id: v.id;
      });*/
		},
		query(attr) {
			return {
				id: !this.uniqueEntry ? this.elem.id : null,
				apiSection: this.url,
				attr: attr.name,
				namePrint: attr.namePrint || attr.name,
				help: attr.help,
				extra: attr.extra
			}
		}
	}
}
</script>
