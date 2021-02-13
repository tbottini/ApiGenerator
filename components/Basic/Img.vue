<template>
    <div>
        <img :src="src" />
    </div>
</template>
<script>
export default {
    props: {
        src: {
            type: String,
            required: true
        }
    }
}
</script>
