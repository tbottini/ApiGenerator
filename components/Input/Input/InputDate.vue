<template>
    <div>
        <p><slot>Date</slot></p>
        <input type="date" @input="onChange">
    </div>
</template>
<script>
export default {
    model: {
        prop: 'date',
        event: 'change',
    },
    props: {
        date: {
            type: Date,
            default: () => { return new Date(Date.now()) },
        }
    },
    methods: {
        onChange(e)
        {
            const date = e.target.valueAsDate;
            this.$emit('change', date);
        }
    }
}
</script>
<style scoped>

div
{
    padding: 3px;
    margin-left: 10px;
}

p
{
    font-size: 1.2em;
    display: inline;
    margin-right: 7px;
}

input
{
    font-size: 1.2em;
    border: none;
    padding: 4px;
    padding-left: 10px;
    padding-right: 10px;
    transition: 0.6s;
}

input:hover, input:focus
{
    box-shadow: 1px 2px 3px 0px gray;
}

</style>