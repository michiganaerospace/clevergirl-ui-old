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
      <router-link to="/camera-create" class="ml-auto inline-flex items-center">
        Add Camera Trap
        <SmIcon name="upload" size="s" class="ml-2" />
      </router-link>
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
          disableDefaultUi: false,
        }"
      >
        <GmapMarker
          :position="cameraLatLon(camera)"
          :clickable="false"
          :draggable="false"
          @click="center = m.position"
        />
      </GmapMap>
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
    cameraLocation(camera) {
      return `${camera.city} | ${camera.county}, ${camera.state}`
    },
    cameraLatLon(camera) {
      return {lat: camera.latitude, lng: camera.longitude};
    },
    formatDates(camera) {
      return `${camera.deployment_date
        .slice(0, 10)
        .replace(/-/g, '/')}—${camera.collection_date
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
  width: 500px;
  cursor: pointer;
}
</style>
