<template>
	<div>
		<template v-for="(input, index) in inputs">
			<InputText :key='index' v-model="form[input.attr]" v-if="input.type == 'text'">{{input.attr}}</InputText>
			<InputArea :key='index' v-model="form[input.attr]" v-else-if="input.type == 'area'" >{{input.attr}}</InputArea>
			<InputDate :key="index" v-model="form[input.attr]" v-else-if="input.type == 'date'" >{{input.attr}}</InputDate>
			<InputImage :key='index' v-model="form[input.attr]" v-else-if="input.type == 'image'">{{input.attr}}</InputImage>
			<InputFile :key="index" v-model="file[input.attr]" @changeFile="changeImage(input.attr, $event)" v-else-if="input.type == 'file'">{{input.attr}}</InputFile>
		</template>
		<InputSubmit @click.native="send" />
	</div>
</template>
<script>
export default {
   props: {
	   url: {
		   type: String,
		   require: true
	   },
	   inputs: {
		   type: Array,
		   required: true,
	   },
   },
   data() {
	   var obj = {};
	   var file = {};
		this.inputs.forEach(input =>
		{
			obj[input.attr] = "";
			if (input.type == 'file')
				file[input.attr] = "";
		})
	   return {
		   form: obj,
		   file: file,
	   };
   },
   methods: {
	   send()
	   {
			var form = new FormData();
			for (const [key, value] of Object.entries(this.form))
			{
				if (value instanceof Date)
					form.append(key, this.dateToString(value));
				else
					form.append(key, value);				
			}

			this.$emit('beforeSend', form);


			this.$axios({
				method: 'post',
				url: '/api' + this.url,
				data: form,
				headers: {'Content-Type': 'multipart/form-data'}
			})
			.then(r =>
			{
				this.$store.commit('setMsgApi', r.data);
				this.$emit('send', r.data);
			})
		},
		changeImage(attr, file)
		{
		   this.form[attr] = file;
		},
		dateToString(datel)
		{
			let date_ob = datel;

			let date = ("0" + date_ob.getDate()).slice(-2);
			let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
			let year = date_ob.getFullYear();
			
			let hours = ("0" + date_ob.getHours()).slice(-2);
			let minutes = ("0" + date_ob.getMinutes()).slice(-2);
			let seconds = ("0" + date_ob.getSeconds()).slice(-2);
			
			return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
		}
   }
}
</script>