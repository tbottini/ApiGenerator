<template>
    <div>
        <label>{{name}}</label>
        <input ref="input"
        @input="change($event)"
        @focus="f"
        type="number" :value="value" class="input" />
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
            type: Number
        },
        name: {
            type: String,
        }
    },
    methods: {
        focus()
        {
            this.$refs.input.focus();
        },
        change(e)
        {
            var v = e.target.value;
            if (v)
                this.$emit('change', parseInt(v));
        },
        f()
        {
            this.$emit('focus');
        }
    }

}
</script>
<style scoped>

.input
{
    background-color: white;
    border-radius: 2px;
    border: 1px solid black;
    padding: 6px;
}

</style>