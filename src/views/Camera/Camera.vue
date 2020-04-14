<template>
  <SmScrollBox class="w-full h-full mx-10">
    <template #header v-if="camera.name.length > 0">
      <h4 v-if="camera.bursts.length > 1">
        {{ camera.name }} — {{ camera.bursts.length }} bursts available
      </h4>
      <h4 v-else>
        {{ camera.name }} — {{ camera.bursts.length }} burst available
      </h4>
      <SmButton
        kind="primary"
        @click.native="uploadImages"
        class="ml-auto inline-flex items-center"
        small
        alt="Upload images to camera."
      >
        Upload
        <SmIcon name="upload" size="s" class="ml-2" />
      </SmButton>
    </template>
    <h4 v-if="camera.pending_images" class="info">
      Please wait. Preprocessing images.
    </h4>
    <SmCard
      v-for="burst in sortedBursts"
      :key="burst.id"
      class="burst-box"
      :title="burstTitle(burst)"
      :subtitle="burstSubtitle(burst)"
      :sidetitle="numberImages(burst)"
      @click.native="clickBurst(burst)"
    >
      <img :src="burstPreview(burst)" class="burst-preview" />
    </SmCard>
  </SmScrollBox>
</template>

<script>
// import Component from "../component_location"
import {getCamera, addImages} from './api/api.js';
import {openFilePicker, compileImageList} from '@/utils.js';

export default {
  components: {},

  props: ['cameraId'],

  data() {
    return {
      camera: {name: '', bursts: []},
      errors: false,
    };
  },

  watch: {
    cameraId: function() {
      this.loadCameraData();
    },
  },

  methods: {
    clickBurst(burst) {
      this.$router.push({
        name: 'burst',
        params: {burstId: burst.id, cameraId: this.cameraId},
      });
    },

    loadCameraData() {
      var self = this;
      getCamera(this.cameraId)
        .then(res => {
          self.camera = res.data;
          if (this.camera.pending_images) {
            // Images are processing, so let's poll.
            setTimeout(this.loadCameraData, 2000);
          }
        })
        .catch(res => {
          let message = `Camera at &nbsp; <b>${$router.currentRoute.path}</b> &nbsp; \
          is unavailable (${res.message})`;
          this.$toasted.show(message, {type: 'error', duration: 5000});
          this.$router.push('/cameras');
        });
    },

    burstTitle(burst) {
      return burst.start_time.slice(0, 10);
    },

    burstSubtitle(burst) {
      return burst.start_time.slice(11, 20);
    },

    burstPreview(burst) {
      let imageUrl =
        'https://cdn.filestackcontent.com/resize=height:225/' +
        burst.images[0].handle;
      return imageUrl;
    },

    numberImages(burst) {
      if (burst.images.length > 1) {
        return `${burst.images.length} images`;
      } else {
        return `${burst.images.length} image`;
      }
    },

    imagesUploaded(results) {
      var imageList = compileImageList(results.filesUploaded, this.cameraId);
      addImages(imageList, this.cameraId)
        .then(res => {
          this.camera = res.data;
        })
        .catch(res => {
          let message = `Images did not upload! (${res.message})`;
          this.$toasted.show(message, {type: 'error', duration: 5000});
        });
    },

    uploadImages() {
      const client = openFilePicker();
      var options = {
        accept: ['image/*'],
        onUploadDone: this.imagesUploaded,
        maxFiles: 100,
        transformations: {crop: false, circle: false, rotate: false},
      };
      client.picker(options).open();
    },
  },

  computed: {
    sortedBursts() {
      var bursts = this.camera.bursts;
      bursts = bursts.sort((a, b) => {
        return Date.parse(a.start_time) > Date.parse(b.start_time) ? 1 : -1;
      });
      return bursts;
    },
  },

  mounted() {
    this.loadCameraData();
  },
};
</script>

<style>
.info {
  color: #2e4172;
}
.burst-box {
  width: 450;
  cursor: pointer;
  margin: 15px;
}
.burst-preview {
  margin: 10px;
}
</style>