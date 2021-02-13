<template>
    <Button

    :class="'btn ' + (value ? 'active' : 'deactive')"
    @click.native="ch">
        <slot></slot>
    </Button>
</template>
<script>
export default {
    model: {
        prop: "value",
        event: "change",
    },
    props: {
        value: {
            type: Boolean,
            required: true,
        }
    },
    methods: {
        ch()
        {
            this.$emit('change', !this.value)
        }
    }
}
</script>
<style scoped>

.btn
{
    transition: 0.3 ease;
}

.active
{
    background-color: white;
    color: black;
}

.deactive
{
    background-color: black;
    color: white;
}

</style>