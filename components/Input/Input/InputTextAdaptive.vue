<template>
    <div>
        <p ref="paragraph"
         contenteditable
         v-on:focus="$emit('focus')"
         @input="onInput($event.target.innerText)"
         :class="{'p-mobile': $mq == 'mobile'}"
         />
    </div>
</template>
<script>
export default {
    model: {
        prop: 'text',
        event: 'change'
    },
    mounted()
    {
        this.$refs.paragraph.innerText = this.text;
    },
    props: {
        text: {
            type: String,
        },
    },
    data()
    {
        return {
        }
    },
    methods: {
        onInput(text)
        {
            this.$emit('change', text);
        },

        focus() // must be implement
        {
            console.log("ref");
            this.$refs.paragraph.focus();
        },

        setText(val)
        {
            this.$refs.paragraph.innerText = val;
        }
    }
}
</script>
<style scoped>
p
{
    font-size: 1.3em;
    margin-top: 0;
    overflow-wrap: anywhere;
    margin-bottom: 6px;
    padding-bottom: 3px;
    
    border-bottom: 2px solid transparent;
    border-radius: 10px;
}

p:focus
{
    padding-bottom: 3px;
    border-bottom: 2px solid black;
    border-radius: 10px;
    outline: none;
}

.p-mobile
{
    font-size: 4vw;
}

</style>