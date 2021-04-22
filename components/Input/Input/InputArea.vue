<template>
    <div>
        <p><slot>textarea: </slot></p>
        <textarea rows="6" :value="value" @input="$emit('change', $event.target.value)" />
    </div>
</template>
<script>
export default {
    model: {
        prop: 'value',
        event: 'change',
    },
    props: {
        value: {
            type: String,
            default: '',
        }
    },
}
</script>
<style scoped>
textarea
{
    border-radius: 2px;
    width: 90%;
    margin-bottom: 20px;
    margin-top: 0;
    font-size: 1.1em;
    font-family: 'acumin', sans-serif;
    font-weight: 200;
    transition: 0.4s box-shadow;
    min-width: 0;
    background-color: #0000FF11;
    padding: 20px;
    border: solid black 1px;
}

textarea:focus
{
    background-color: #0000;
}

p
{
    font-size: 1.2em;
    margin-bottom: 4px;
}

</style>