<template>
    <div id="slider" :style="{'--color': this.color}">
        <p class="present"><slot></slot></p>
        <div id="input">
            <div id="active" :style="active"></div>
            <input type="range" @input="$emit('change', $event.target.value)"/>
        </div>
        <div style="min-width: 30px; max-width: 40px; overflow: hidden;">{{ value }}</div>
        
    </div>
</template>
<script>
export default {
    model: {
        prop: 'value',
        event: 'change'
    },
    props:
    {
        value: {
            type: String,
        },
        color: {
            type: String,
            default: '#fdf1b8'
        }
    },
    computed: {
        active()
        {
            return {
                width: this.value + '%',
                '--color': this.color,
            }
        },
    }
}
</script>
<style scoped>
#slider
{
    height: 75px;
    width: 170px;
    display: flex;
    flex-direction: row;
    margin: 3px 10px 10px 10px;
    transition: 0.3s box-shadow;
    min-width: 220px;
}

#slider:hover
{
    box-shadow: 1px 2px 3px 1px var(--color);
}

#input
{
    position: relative;
    height: 100%;
    width: 100%;
    border-right: 1px solid black;
    margin-right: 10px;
}

input[type="range"]
{
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    margin: 0;
}


#active
{
    height: 100%;
    background-color: var(--color);
    position: absolute;
}

.present
{
    font-size: 1.2em;
    margin: 0;
    margin-left: 6px;
    padding: 0;
    width: 1em;
    transform: scale(-1, -1);
    writing-mode: vertical-lr;
    text-orientation: mixed;
    font-family: 'Roboto';
}

</style>