<template>
  <SmScrollBox class="w-full h-full mx-10">
    <template #header>
      <input
        type="search"
        placeholder="Search"
        v-model="searched"
        maxlength="32"
        class="inline"
      />
      <SmButton
        kind="primary"
        @click.native="createCamera"
        class="mr-2 ml-auto inline-flex items-center"
        small
        alt="Add Camera!"
        >
        Camera
        <SmIcon name="upload" size="s" class="ml-2" />
      </SmButton>
    </template>
    <h4 v-if="cameras.length == 0">No Cameras Available</h4>

    <SmCard
      @click.native="openCamera(camera)"
      v-for="(camera, index) in cameras"
      v-bind:key="camera.id"
      :title="camera.name"
      :subtitle="cameraLocation(camera)"
      :sidetitle="formatDates(camera)"
      class="camera-box"
    >
      <GmapMap
        v-if="camera.mode=='Camera Trap'"
        :center="cameraLatLon(camera)"
        :zoom="6"
        map-type-id="satellite"
        style=" height: 300px"
        :options="{
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          disableDefaultUI: true,
          scrollwheel: false
        }"
      >
        <GmapMarker
          :position="cameraLatLon(camera)"
          :clickable="false"
          :draggable="false"
          :scalable='false'
          @click="center = m.position"
        />
      </GmapMap>
      <img v-else class='camera-image' src='@/assets/2x/species@2x.png'>
    </SmCard>
  </SmScrollBox>
</template>

<script>
// import Component from "../component_location"
import {getCameras} from './api/api.js';

export default {
  components: {},

  props: [],

  data() {
    return {
      searched: '',
      cameras: [],
      markers: [{position: {lat: 43.22, lng: -83.76}}],
    };
  },

  watch: {},

  methods: {
    createCamera() {
      this.$router.push({name:'cameraCreate'})
    },
    cameraLocation(camera) {
      if (camera.mode == 'Camera Trap') {
      return `${camera.city} | ${camera.county}, ${camera.state}`
      } else {
        return 'Species Specific Images'
      }
    },
    cameraLatLon(camera) {
      return {lat: camera.latitude, lng: camera.longitude};
    },
    formatDates(camera) {
      return `${camera.deployment_date
        .slice(0, 10)
        .replace(/-/g, '/')}-${camera.collection_date
        .slice(0, 10)
        .replace(/-/g, '/')}`;
    },
    openCamera(camera) {
      console.log('Opening the camera!');
      this.$router.push({name: 'camera', params: {cameraId: camera.id}});
    },
  },

  computed: {},

  mounted() {
    getCameras(this.$store.state.activeOrgId)
      .then(res => {
        this.cameras = res.data;
      })
      .catch(res => {
        let message = `Could not load cameras! (${res.message})`;
        this.$toasted.show(message, {type: 'error', duration: 5000});
      });
  },
};
</script>

<style>
.camera-box {
  width: 450px;
  cursor: pointer;
  height: 385px;
  margin-left: 15px;
  margin-top: 25px;
}
.camera-image {
  object-fit: scale-down;
}
</style>
