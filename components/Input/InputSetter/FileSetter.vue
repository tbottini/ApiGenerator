<template>
        <div>
           <Setter :query="query"
            @edit="edit"
            @confirm="confirm"
            @reset="reset"
            ref="setter"
           >
                <InputFile 
                ref="inputFile"
                :url="url"
                @change="updateElem"
                @changeFile="changeFile"
               />
           </Setter>
        </div>
</template>
<script>
import apiHandler from '~/assets/class/apiHandler.js';

export default {
    props: {
        query: {
            type: Object,
            required: true,
        },
        src: {
            type: String,
            default: null,
        }
    },
    data() {
        return {
            url: this.src,
            file: null
        }
    },
    methods: {
        updateElem(elem) {
            this.url = elem;
            if (this.url)
            {
                this.$refs.setter.modeEditionSet(true);
            }
        },
        changeFile(file) {
            this.file = file;
        },
        edit()
        {
            this.$refs.setter.modeEditionSet(false);
            this.$refs["inputFile"].open();
        },
        reset()
        {
            this.url = "";
            this.file = null;
        },
        confirm()
        {
            var form = new FormData();
            form.append('attr', this.query.attr);
            form.append('value', this.file);
            this.$axios({
                method: 'post',
                url: '/api/' + this.query.apiSection + '/set/' + (this.query.id || ''),
                data: form,
                headers: {'Content-Type': 'multipart/form-data'},        
            })
            .then(r => {
                var msg = r.data;
                if (!msg.error)
                    msg.msg = "edit successful";
                this.$store.commit('setMsgApi', msg);
                this.$emit('update', r.data);
    
            });
            
        },
    }
}
</script>
<style>
</style>