<template>
    <div class="anchor">
        <div
            v-for="(n, i) in 9"
            :key="i"
            
            @click="change({
                x: (50 * (i % 3)),
                y: parseInt(i / 3) * 50,
            })"
            
            :style="transform(i)"
        >
            <icon  class="icon" :icon="['fas', i != 4 ? 'chevron-up' : 'circle',
            
            ]" />
        </div>
    </div>
</template>
<script>
export default {
    methods: {
        change(val) {
            this.$emit('change', val);
        },
        transform(i) {
            if (i == 4)
                return {};

    ;
            const DEGA = [-45, 0, 45, -90, 0, 90, -135, 180, 135];
            var deg = DEGA[i];
            return 'transform: rotate(' + deg + 'deg);'
            
        }
    },
}
</script>
<style scoped>
.anchor
{
    display: grid;
    grid-template-columns: repeat(3, 50px);
    grid-gap: 10px;
    grid-auto-rows: minmax(3, 50px);
    width: 150px;
    height: 150px;
    margin: 30px;
}


.icon
{
    width: 50px;
    height: 50px;
    transition: 0.2s;
        border-radius: 20px;
}

.icon:hover
{
    background-color: black;
    color: white;
}

</style>