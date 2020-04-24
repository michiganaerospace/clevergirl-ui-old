<template>
  <div class="flex justify-center w-full h-full" v-if="burst">
    <div class="container" v-if="imagesLoaded">
      <header
        v-if="currentImage"
        class="flex items-baseline mb-5"
        style="min-width: 1400px; position: relative"
      >
        <h4 class="inline mr-2" v-if="camera.name">
          <a :href="cameraPath">{{ camera.name }}</a>
          {{ burst.start_time.slice(0, 10).replace(/-/g, '/') }}
        </h4>
        <small>
          {{ currentImage.captured_at.slice(11, 20) }} ({{
            currentImageIndex + 1
          }}/{{ burst.images.length }})
        <SmIcon class='info' name="info" size='m'/>
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
            :target="currentTarget"
            :current-image="currentImage"
            v-if="imagesLoaded"
          ></smart-label>
          <template #right class="invisible"> </template>
        </SmColumnBox>
      </main>
    </div>
  </div>
  <SmLoading v-else />
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
      burst: null,
      currentImageIndex: 0,
      imagesLoaded: false,
      camera: {id: 0},
      targetSelected: false,
      currentTarget: null,
    };
  },

  watch: {
    currentImageIndex() {
      this.setIndex();
    },
    index() {
      this.currentImageIndex = this.index;
    },
    burstId() {
      this.burst = null;
      this.loadBurst();
    },
  },

  methods: {
    updateTarget(currentTarget) {
      this.currentTarget = currentTarget;
    },

    loadBurst() {
      getBurst(this.burstId)
        .then(res => {
          this.burst = res.data;
          this.currentImageIndex = parseInt(this.$route.query.index) || 0;
          this.imagesLoaded = true;
          this.setIndex();
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

    setIndex() {
      if (this.index != this.currentImageIndex) {
        this.$router.push({
          name: 'burst',
          query: {index: this.currentImageIndex},
        });
      }
    },

    selectImage(index) {
      this.currentImageIndex = index;
    },

    nextBurst() {
      var nextBurstId =
        this.camera.burst_ids[parseInt(this.currentBurstIndex) + 1] ||
        this.camera.burst_ids[0];

      this.burst = null;
      this.imagesLoaded = false;
      this.$router.replace({
        name: 'burst',
        params: {cameraId: this.cameraId, burstId: parseInt(nextBurstId)},
      });
    },

    prevBurst() {
      var prevBurstId =
        this.camera.burst_ids[this.currentBurstIndex - 1] ||
        this.camera.burst_ids.slice(-1)[0];
      this.imagesLoaded = false;
      this.$router.replace({
        name: 'burst',
        params: {cameraId: this.cameraId, burstId: prevBurstId},
      });
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

    currentBurstIndex() {
      var idx = 0;
      var currentBurstIndex = null;
      var self = this;
      this.camera.burst_ids.forEach(id => {
        try {
          if (id == self.burst.id) {
            currentBurstIndex = idx;
          }
        } catch {
          debugger;
        }
        idx += 1;
      });
      return currentBurstIndex;
    },

    index() {
      return this.$route.query.index;
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
      return '#/cameras/' + this.cameraId;
    },

    currentPage() {
      return Math.ceil((this.currentBurstIndex + 1) / 9);
    },
  },

  mounted() {
    this.loadBurst();
    this.loadCameraData();
    var self = this;
    window.addEventListener('keydown', e => {
      if (!this.burst) {
        return;
      }
      if (e.keyCode == 39) {
        // RIGHT ARROW
        if (e.shiftKey) {
          this.nextBurst();
        } else if (self.burst.images.length > 1) {
          d3.select('#canvas').remove();
          self.currentImageIndex += 1;
          if (self.currentImageIndex > self.burst.images.length - 1) {
            self.currentImageIndex = 0;
          }
        }
      } else if (e.keyCode == 37) {
        // LEFT ARROW
        if (e.shiftKey) {
          self.prevBurst();
        } else if (self.burst.images.length > 1) {
          d3.select('#canvas').remove();
          self.currentImageIndex -= 1;
          if (self.currentImageIndex < 0) {
            self.currentImageIndex = self.burst.images.length - 1;
          }
        }
      } else if (e.keyCode == 38) {
        console.log('I think the page is ' + self.currentPage);
        self.$router
          .push({
            name: 'camera',
            params: {cameraId: self.cameraId},
            query: {page: self.currentPage},
          })
          .catch(err => {});
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
  max-height: 600px;
  overflow: scroll;
}
.image-preview {
  width: 200px;
  margin-bottom: 8px;
  margin-top: 8px;
}
.active {
  border: 2px solid #47e5f2;
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
.info:hover {
  color: blue
}
</style>
