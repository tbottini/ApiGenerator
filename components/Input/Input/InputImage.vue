<template>
    <div>
        <input
        type="file" name="file" id="file" class="inputfile"
        accept="image/*"
        @change="onFileChange" />
        <label for="file" class="btn"><slot>Select File</slot></label>
    </div>
</template>
<script>
export default {
    data()
    {
        return {
            url: null,
        }
    },
    methods: {
        onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
            this.$emit('imagePick', this.url, file);
        }        
    }
}
</script>
<style scoped>

div
{
    margin: 0px;
}

#file
{
    display: none;
}

.btn
{
    font-size: 1.2em;
    border-radius: 3px;
    padding: 10px 20px;
    transition: 0.3s;
    cursor: pointer;
    border: 1px solid lightgrey;
    border-radius: 5px;
    display: block;
    min-width: 90px;
}

.btn:hover
{
    box-shadow: 1px 3px 2px 0px lightgrey;
    
}

</style>