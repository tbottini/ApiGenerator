<template>
        <video
				:style="objectPosition"
		ref="video" id="videoPlayer"  muted loop autoplay>
            <source
                :src="'/api/projects/video/' + src"
                type="video/mp4">
        </video> 
</template>
<script>
import $ from 'jquery';

export default {
    mounted()
    {

    },
    props: {
        src: {
            type: String,
            required: true,
		},
		anchor: {
			type: Object,
			required: false,
		},
	},
	watch: {
		src(val)
		{
			this.$refs.video.load();
			this.$refs.video.play();
		},
		restart()
		{
			this.$refs.currentTime = 0;
		},
		reload()
		{
			this.restart();
			this.$refs.video.load();
			this.$refs.video.play();
		},
		play()
		{
			this.$refs.video.play();
		},
		stop()
		{
			this.$refs.video.currentTime = 0;
			this.$refs.video.pause();			
		}
		
	},
	computed: {
		objectPosition()
		{
			if (!objectPosition) return '';
			var objectPosition = `objectPosition: ${this.anchor.x}% ${this.anchor.y}%`;
			return objectPosition;
		}
	}
}
</script>
<style scoped>

video {
  position: absolute;
  z-index: 0;
  object-fit: cover;
  width:100%;
  height:100%;
}

</style>
