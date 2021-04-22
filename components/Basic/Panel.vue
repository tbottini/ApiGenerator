<template>
  <div id="panel" @mousemove="mousemove">
    <Video v-if="isVideo" :src="source" />
    <img
      :class="{ img: !accueil, homepage: accueil }"
      :style="objectPosition"
      :src="'/api/_ipx/static/image/' + source"
      v-else
    />
    <Descr
      :homepage="accueil"
      :class="accueil ? 'accueil-' + $mq : 'description'"
      :name="project.name"
      :descr="project.descr"
    />
    <svg
      v-if="!accueil && activeArrows"
      @click="$emit('arrow-up-click')"
      :class="'arrow top ' + style"
      width="60px"
      height="40px"
    >
      <path stroke-width="2px" d="M0 0 L30 32 L60 0"></path>
    </svg>
    <svg :class="'arrow bottom ' + style" width="60px" height="40px">
      <path stroke-width="2px" d="M0 0 L30 32 L60 0"></path>
    </svg>
  </div>
</template>
<script>
import Project from "~/assets/class/Project";

export default {
  props: {
    project: {
      type: Project,
      required: true
    },
    accueil: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timeout: null,
      activeArrows: false
    };
  },
  methods: {
    mousemove(e) {
      const TIMESTAMP = 700;
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.activeArrows = true;
      this.timeout = setTimeout(() => {
        this.activeArrows = false;
      }, TIMESTAMP);
    }
  },
  computed: {
    style() {
      return this.activeArrows ? "active" : "deactive";
    },
    isVideo() {
      return this.$mq == "mobile"
        ? this.project.isVideoMobile || this.project.isVideo
        : this.project.isVideo;
    },
    source() {
      var src =
        this.$mq == "mobile"
          ? this.project.imageMobile || this.project.path
          : this.project.path;
      return src;
    },
    objectPosition() {
      var objectPosition = `objectPosition: ${this.project.anchorX}% ${this.project.anchorY}%`;
      console.log(
        "anchor ",
        this.project.anchorX,
        this.project.anchorY,
        objectPosition
      );
      return objectPosition;
    }
  }
};
</script>
<style scoped>
#panel {
  width: 100%;
  height: 100%;
  background-color: black;
  position: relative;
}

.description {
  position: absolute;
  bottom: 7%;
  color: white;
  font-size: 1.3em;
  z-index: 50;
  width: 100%;
  text-align: center;
}

.accueil-desktop,
.accueil-mobile {
  position: absolute;
  bottom: 30%;
  color: white;
  z-index: 50;
  width: 100%;
  font-size: 1.4em;
  text-align: center;
}

.accueil-mobile {
  bottom: 20vh;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.homepage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* arrow */
.arrow {
  position: absolute;
  right: 10%;
  stroke: white;
  fill: transparent;
  animation: arrow 2s;
  animation-iteration-count: infinite;
}

.top {
  transform: rotate(180deg);
  top: 10%;
}

.bottom {
  bottom: 10%;
}

.deactive {
  display: none;
}

.active {
}

@keyframes arrow {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  80% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
