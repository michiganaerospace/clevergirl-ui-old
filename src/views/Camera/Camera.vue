<template>
  <SmScrollBox class="w-full h-full mx-10" v-if="cameraLoaded">
    <v-dialog />
    <template #header v-if="camera.name.length > 0">
      <h4>{{ camera.name }}</h4>

      <paginate
        v-on:page-change="handlePageChange"
        :current-page="currentPage"
        :number-of-pages="numberOfPages"
      ></paginate>

      <div style="display: block; max-width: 50%"></div>

      <div class="inline-flex items-end ml-auto">
        <SmButton
          kind="secondary"
          @click.native="attemptDelete"
          class="mr-2"
          small
          alt="Delete Camera!"
        >
          Delete
          <SmIcon name="x-circle" size="s" class="ml-2" />
        </SmButton>

        <SmButton
          kind="primary"
          @click.native="uploadImages"
          small
          alt="Upload images to camera."
        >
          Upload
          <SmIcon name="upload" size="s" class="ml-2" />
        </SmButton>
      </div>
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
  <SmLoading v-else />
</template>

<script>
// import Component from "../component_location"
import Paginate from './components/Paginate.vue';
import {getCamera, addImages, deleteCamera} from './api/api.js';
import {openFilePicker, compileImageList} from '@/utils.js';

export default {
  components: {Paginate},

  props: ['cameraId'],

  data() {
    return {
      camera: {name: '', bursts: []},
      cameraLoaded: false,
      errors: false,
      currentPage: 1,
      searched: ''
    };
  },

  watch: {
    cameraId: function() {
      this.loadCameraData();
    },
    currentPage: function  () {
      this.loadCameraData()
    }
  },

  methods: {
    handlePageChange(newPage) {
      this.$router.replace({query: {page: newPage}}).catch(err=>{})
      this.currentPage = newPage;
    },

    deleteCamera() {
      console.log('DELETING THE CAMERA.');
      deleteCamera(this.camera.id).then(this.$router.push({name: 'cameras'}));
    },

    attemptDelete() {
      this.$modal.show('dialog', {
        title: 'Are you sure you want to delete the camera?!',
        text:
          'This action is permanent and will delete all images and labels' +
          ' associated with the camera.',
        buttons: [
          {
            title: 'Delete the Camera',
            handler: () => {
              this.$modal.hide('dialog');
              this.deleteCamera();
            },
          },
          {
            title: 'Cancel',
          },
        ],
      });
    },

    clickBurst(burst) {
      this.$router.push({
        name: 'burst',
        params: {burstId: burst.id, cameraId: this.cameraId},
      });
    },

    loadCameraData() {
      this.cameraLoaded = false
      console.log('Loading Camera Data.');
      var self = this;
      this.currentPage = parseInt(this.$route.query.page) || 1
      getCamera(this.cameraId, this.currentPage)
        .then(res => {
          console.log('Got response.');
          self.camera = res.data;
          // Verify that the page exists. If not, go to the first page.
          if (this.currentPage > Math.ceil(this.camera.burst_ids.length/9)){
            this.currentPage = 1
            this.$router.replace({query:{page:1}})
            this.loadCameraData()
          }
          console.log('Done loading camera data.');
          this.cameraLoaded = true;
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
        burst.preview_handle;
      return imageUrl;
    },

    numberImages(burst) {
      if (burst.number_images > 1) {
        return `${burst.number_images} images`;
      } else {
        return `${burst.number_images} image`;
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
      var bursts = this.camera.min_bursts;
      bursts = bursts.sort((a, b) => {
        return Date.parse(a.start_time) > Date.parse(b.start_time) ? 1 : -1;
      });
      return bursts;
    },
    numberOfPages() {
      return Math.ceil(this.camera.burst_ids.length/9)
    }
  },

  mounted() {
    if (!this.$route.query.page) {
      this.$router.replace({query:{page:1}})
    } else {
      this.currentPage = this.$route.query.page
    }
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
.left-button {
  margin-right: 15px;
}
.v--modal-overlay {
  margin-top: -0px !important;
}
</style>
