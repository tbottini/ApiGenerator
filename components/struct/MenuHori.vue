<template>
    <nav>
        <ul :class="'menu-' + $mq">
            <template v-for="(direction, index) in dir">
                <div style="display: flex; flex-direction: row;" :key="index">
                    <li  :class="'dir-' + $mq">
                        <nuxt-link :to="direction.path"
                            :style="itemColor(direction.color || 'black')" :class="'menu-item-' + $mq" >{{ direction.name }}
                        </nuxt-link>
                    </li>
                    <div class="dir-desktop" v-if="$mq == 'desktop'">
                    <p :class="'menu-item-' + $mq" v-if="index != (dir.length - 1)">
                        —    
                    </p>
                    </div>
                </div>
            </template>
        </ul>
        
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
        active: {
                type: Boolean,
                default: true,
        },
    },
    computed: {
    },
    methods: {
        capitalize(str)
        {
            return str.replace(/\b\w/g, l => l.toUpperCase());
        },
        itemColor(color)
        {
            return {
                'color': color,
                'text-decoration-color': color,
            }
        }
    }

}
</script>
<style scoped>

nav
{
    width: 100%;
}

ul
{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    height: 100%;
}

.menu-mobile
{
    font-size: clamp(1px, 4vw, 20px) !important;
    padding-left: 4vw !important;
}


.menu-desktop, .menu-mobile
{
    padding-left: 20px;
}



.dir-desktop, .dir-mobile
{
    list-style: none;
    color: white;
    display: table;
    height: 100%;
    font-size: 1.3em;
    margin: 0 5px;
}

.dir-mobile
{
    font-size: clamp(1px, 3.2vw, 1.3em) !important;
}

a
{
    text-decoration: none;
}

a:hover
{
    text-decoration: underline;
    text-decoration-color: white;
}

nav
{
    display: flex;
    flex-direction: row;
    align-items: center;
}

.spacer
{
    padding: 10px 0;
    line-height: 0.8em;
    color: white;
    display: inline;
    padding-left: 4px;
}

.menu-item-desktop, .menu-item-mobile
{
    color: white;
    display: table-cell;
    vertical-align: middle;
}

.menu-item-mobile
{
   
}

</style>