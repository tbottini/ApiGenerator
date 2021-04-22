<template>
        <video ref="video" id="videoPlayer"  muted loop autoplay>
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
        }
	},
	watch: {
		src(val)
		{
			console.log("video src updated", val);
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
