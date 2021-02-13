<template>
    <div v-cloak
            @drop.prevent="drop"
            @dragover.prevent="dragover"
            @dragleave.prevent="dragover"
            @dragenter.prevent
            :class="{active: url}"
    >
        <input
        type="file" ref="file" name="file" id="file" class="inputfile"
        accept="video/*;image/*"
        @change="chooseFile"
        />
        <label @click="open" class="btn"><slot>Select File</slot></label>
        <label>{{url}}</label>
        <br>
    </div>
</template>
<script>
export default {
    model: {
        prop: 'url',
        event: 'change'
    },
    props: {
        url: {
            type: String,
            default: ''
        }
    },
    methods: {
        drop(e) {
            event.preventDefault();
            var files = event.dataTransfer.files;
            if (files.length > 1)
            {
                this.$store.commit('setMsgApi', {error: "juste one file"});
            }
            else
            {
                var file = files[0];
                if (!['video', 'image'].includes(file.type.split('/')[0]))
                    return this.$store.commit('setMsgApi', {error: 'bad type of file'});
                else
                    this.onFileChange(file);
            }

        },
        dragover(e)
        {
            e.preventDefault()
        },
        chooseFile(e)
        {
            this.onFileChange(e.target.files[0]);
        },
        onFileChange(file) {
            this.$emit('change', URL.createObjectURL(file)); 
            this.$emit('changeFile', file);           
        },
        open()
        {
            this.$refs.file.click();
        }
    }
}
</script>
<style scoped>

img
{
    object-fit: contain;
}

div
{
}

#file
{
    display: none;
}

.btn
{
    font-size: 1.2em;
    border-radius: 3px;
    padding: 10px;
    transition: 0.3s;
    cursor: pointer;
    border: 1px solid black;
    border-radius: 5px;
    display: block;
    min-width: 90px;
	max-width: 500px;
    color: black;
}

.btn:hover
{
    background-color: black;
    color: white;
    
}

.imgWrapper
{
    
}

.active .btn
{
    background-color: #495464;
    color: white;
}

</style>