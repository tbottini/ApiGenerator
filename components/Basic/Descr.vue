<template>
    <div class="descr">
        <h2 :class="'title-' + $mq">{{name}}</h2>
        <h3 :class="'uppercase subtitle-' + $mq" v-if="!homepage">{{descr}}</h3>
        <h2 :class="'homepage-text-' + $mq" v-else>{{descr}}</h2>
    </div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        descr: {
            type: String,
            required: true
        },
        homepage: {
            type: Boolean,
            default: false,
        }
    }
}
</script>
<style scoped>

h3, h2
{
    margin: 0;
    color: white;
}

.title-desktop, .homepage-text-desktop
{
    color: white;
    font-size: 1.4em;
}

.descr
{
    padding: 0 10%;
}

h3, .homepage-text-desktop, .homepage-text-mobile
{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 15; /* number of lines to show */
    -webkit-box-orient: vertical;

}

.homepage-text-mobile
{
    color: white;
    font-size: clamp(0.3em, 4vw, 1.4em) !important;
}

.title-mobile
{
     font-size: clamp(0.3em, 5vw, 1.4em) !important;
}

.subtitle-desktop
{
    font-size: 0.9em;
}

.subtitle-mobile
{
    font-size: clamp(0.3em, 5vw, 1.4em) !important;

}

.homepage-text-desktop, .homepage-text-mobile
{
    padding: 0 7%;
    font-size: 1.3em;
}

.uppercase { text-transform: uppercase}

</style>