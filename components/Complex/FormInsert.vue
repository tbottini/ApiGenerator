<template>
      <Form
        class="inputInsert"
        :url="'/' + url + '/post'"
        :inputs="inputs"
        @send="$emit('send')"
        @beforeSend="$emit('beforeSend')"
        >AJOUTER</Form
      >
</template>
<script>
export default {
    name: "FormInsert",
     props: {
    url: {
      type: String,
      require: true
    },
    inputs: {
      type: Array,
      required: true
    }
  }, 
}
</script>
<style lang="sass" scoped>
@import '~/assets/manage'

</style>