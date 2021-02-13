<template>
    <nav :style="nav">
        <div v-if="activePanel" id="panel" :style="panel" ref="panel">
            <Button v-if="$mq == 'mobile'" @click.native="$emit('change', false)">X</Button>
            <nuxt-link :to="home">
                <slot></slot>
            </nuxt-link>
            <ul>
                <li :class="$mq == 'desktop' ? 'li-desk' : 'li-mobile'" v-for="(direction, index) in dir" :key="index"
                    @click="optionPress(direction.path)"
                >
                   <p :style="'color: white'" :class="'dir ' + 'dir-' + $mq">{{ direction.name.toUpperCase() }}</p>
                </li>
            </ul>
        </div>
    </nav>
</template>
<script>

export default {
    model: {
        prop: "active",
        event: "change",
    },
    props: {
        dir: {
            type: Array,
            required: true,
        },
        home: {
            type: String,
            default: "/"
        },
        width: {
            type: String,
            default: "25%",
        },
        minWidth: {
            type: String,
            default: "230px",
        },
        maxWidth: {
            type: String,
            default: "300px"
        },
        paddingtop: {
            type: String,
            default: "0",
        },
        active: {
                type: Boolean,
                default: true,
        },
    },
    computed: {
        activePanel(){

            return this.$mq == "desktop" || (this.$mq == "mobile" && this.active)
        },
        nav()
        {
            if (this.$mq == "desktop")
                return {
                    'width': this.width,
                    'min-width': this.minWidth,
                    'max-width': this.maxWidth,
                    'flex-shrink': '0'
                }
            else
                return {};
        },
        panel()
        {
            if (this.$mq == "desktop")
                return {
                    "width": this.width,
                    top: this.paddingtop,
                    "min-width": this.minWidth,
                    "max-width": this.maxWidth,
                }
            else
                return {
                    "width": "100%",
                    "overflow": "hidden",
                    "opacity": "1"
                }
        },
    },
    methods: {
        optionPress(url)
        {
            this.$router.push(url);
            if (this.$mq == "mobile")
                this.$emit('change', false);

        },
        capitalize(str)
        {
            return str.replace(/\b\w/g, l => l.toUpperCase());
        }
    }

}
</script>
<style scoped>

*
{
    overflow: hidden;
}

#panel
{
    position: fixed;
    height: 100vh;
    /*box-shadow: inset -7px 0 9px -7px rgba(0,0,0,0.7);*/
    border-right: 1px solid black;
	background-color: #495464;
    z-index: 4;
    overflow-y: auto;
}

ul
{
    padding-left: 0;
}

h2
{
    color: white;
    font-size: 2em;
    margin: 0;
    padding: 30px;
}

li
{
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 40px;
    list-style: none;
    color: white;  
    text-decoration: none;
    font-size: 1.4em;
    cursor: pointer;
}

.dir
{
    width: min-content;
    margin: 0;
    border-bottom: 1px solid transparent;
}

.dir:hover
{
    border-bottom: 1px solid white;
}

.dir-mobile
{
    margin: 0 auto;
}

.li-mobile
{
    text-align: center;
    padding-left: 0;
}


</style>