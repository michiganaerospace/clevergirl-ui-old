<template>
  <div class="flex justify-center w-full h-full">
    <div class="container" v-if="imagesLoaded">
      <header
        class="flex items-baseline mb-5"
        style="min-width: 1400px; position: relative"
      >
        <h4 class="inline mr-2" v-if="camera.id > 0">
          <a :href="cameraPath">{{ camera.name }}</a>
          {{ burst.start_time.slice(0, 10).replace(/-/g, '/') }}
        </h4>
        <small>
          {{ currentImage.captured_at.slice(11, 20) }} ({{
            currentImageIndex + 1
          }}/{{ burst.images.length }})
        </small>
        <target-select
          v-model="currentTarget"
          @input="updateTarget"
        ></target-select>
      </header>

      <main>
        <SmColumnBox>
          <template #left>
            <SmCard class="leftbox">
              <img
                v-for="(image, index) in sortedImages"
                :key="image.id"
                :src="image.url"
                class="image-preview"
                v-bind:class="{active: index == currentImageIndex}"
                @click="selectImage(index)"
              />
            </SmCard>
          </template>
          <smart-label
            :image-url="currentImageUrl"
            :target="currentTarget"
          ></smart-label>
          <template #right class="invisible"> </template>
        </SmColumnBox>
      </main>
    </div>
  </div>
</template>

<script>
// import Component from "../component_location"
import {getBurst} from './api/api.js';
import {getCamera} from '../Camera/api/api.js';
import SmartLabel from './components/SmartLabel.vue';
import TargetSelect from './components/TargetSelect.vue';

export default {
  components: {SmartLabel, TargetSelect},

  props: ['burstId', 'cameraId'],

  data() {
    return {
      burst: {images: []},
      currentImageIndex: 0,
      imagesLoaded: false,
      camera: {id: 0},
      targetSelected: false,
      currentTarget: null,
    };
  },

  watch: {},

  methods: {
    updateTarget(currentTarget) {
      this.currentTarget = currentTarget;
      console.log(currentTarget);
    },
    loadBurst() {
      getBurst(this.burstId)
        .then(res => {
          this.burst = res.data;
          this.currentImageIndex = 0;
          this.imagesLoaded = true;
        })
        .catch(res => {
          let message = `Burst at &nbsp; <b>${$router.currentRoute.path}</b> &nbsp; \
          is unavailable (${res.message})`;
          this.$toasted.show(message, {type: 'error', duration: 5000});
          this.$router.push('/cameras/' + this.cameraId);
        });
    },

    loadCameraData() {
      getCamera(this.cameraId)
        .then(res => {
          this.camera = res.data;
        })
        .catch(res => {
          let message = `Camera at &nbsp; <b>${$router.currentRoute.path}</b> &nbsp; \
          is unavailable (${res.message})`;
          this.$toasted.show(message, {type: 'error', duration: 5000});
          this.$router.push('/cameras');
        });
    },

    selectImage(index) {
      this.currentImageIndex = index;
    },
  },

  computed: {
    sortedImages() {
      function compare(a, b) {
        return Date.parse(a.captured_at) - Date.parse(b.captured_at);
      }
      return this.burst.images.sort(compare);
    },
    currentImage() {
      return this.burst.images[this.currentImageIndex];
    },

    currentImageUrl() {
      return (
        // 'https://cdn.filestackcontent.com/resize=height:600/' +
        // this.currentImage.handle
        'https://cdn.filestackcontent.com/' + this.currentImage.handle
      );
    },

    imageName() {
      return `${this.currentImageIndex + 1}/${this.burst.images.length}`;
    },

    cameraPath() {
      return '#/cameras/' + this.camera.id;
    },
  },

  mounted() {
    this.loadBurst();
    this.loadCameraData();
    var self = this;
    window.addEventListener('keydown', e => {
      if (e.keyCode == 39 || e.keyCode == 40) {
        this.currentImageIndex += 1;
        if (self.currentImageIndex > self.burst.images.length - 1) {
          self.currentImageIndex = 0;
        }
      } else if (e.keyCode == 37 || e.keyCode == 38) {
        this.currentImageIndex -= 1;
        if (this.currentImageIndex < 0) {
          this.currentImageIndex = this.burst.images.length - 1;
        }
      }
    });
  },
};
</script>

<style scoped>
.sidebox {
  width: 250px;
}
.leftbox {
  width: 225px;
}
.image-preview {
  width: 200px;
  margin-bottom: 8px;
  margin-top: 8px;
}
.active {
  border: 2px solid blue;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.image-box {
  border: 2px solid black;
  max-height: 700px;
}
.SmColumnBoxRight {
  padding: 0px;
}
.invisible {
  display: none;
}
</style>
