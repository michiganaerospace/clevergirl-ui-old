<template>
  <div class="w-full h-full flex items-center justify-center">
    <SmCard
      class="w-1/2"
      title="Add a New Camera Trap"
      subtitle="Add a new camera trap and associated images"
      :sidetitle="camera.mode + ' Mode'"
    >
      <form @submit.prevent="submit">
        <label for="mode">Mode</label>
        <select v-model="camera.mode" id="mode">
          <option value="" disabled selected>Locations</option>
          <option v-for="mode in modes" :key="mode.id" :value="mode.name">
            {{ mode.name }}
          </option>
        </select>

        <label for="cameraName">Camera Name</label>
        <input v-model="camera.name" type="text" id="cameraName" />

        <label for="organizations">Organization</label>
        <select v-model="camera.organization_id" id="organizations">
          <option value="" disabled selected>Locations</option>
          <option
            v-for="org in user.organizations"
            :key="org.id"
            :value="org.id"
          >
            {{ org.name }}
          </option>
        </select>

        <label v-if="camera.mode == 'Camera Trap'" for="location"
          >Latitude, Longitude — e.g., 42.22, -83.72</label
        >
        <input
          v-if="camera.mode == 'Camera Trap'"
          v-model="camera.location"
          type="text"
          id="location"
        />

        <label v-if="camera.mode == 'Camera Trap'" for="deployment"
          >Dates Deployed</label
        >
        <v-date-picker
          v-if="camera.mode == 'Camera Trap'"
          id="deployment"
          class="date-picker"
          color="gray"
          is-dark
          :mode="mode"
          v-model="camera.datesDeployed"
        />

        <label for="notes">Field Notes</label>
        <textarea
          v-model="camera.fieldNotes"
          type="text"
          id="notes"
          class="notes border pl-4 pt-2"
        />

        <div class="spacer"></div>

        <SmButton kind="primary" type="submit" class="spacer">
          Add Camera
        </SmButton>
      </form>
    </SmCard>
  </div>
</template>

<script>
// import Component from "../component_location"
import createCamera from './api/createCamera.js';

export default {
  components: {},

  props: [],

  data() {
    return {
      camera: {
        name: 'Camera Trap 001',
        mode: 'Camera Trap',
        location: '43.22, -83.72',
        datesDeployed: {start: new Date(), end: this.addDays(new Date(), 10)},
        fieldNotes:
          "One time we saw a snake, but it probably wasn't a venomous one. Or maybe it was a lizard.",
        organization_id: 1,
      },
      mode: 'range',
      modes: [{name: 'Camera Trap', id: 1}, {name: 'Species Collection'}],
    };
  },

  watch: {},

  methods: {
    addDays(date, days) {
      const copy = new Date(Number(date));
      copy.setDate(date.getDate() + days);
      return copy;
    },
    submit() {
      var lat_lon = this.camera.location.replace(' ', '').split(',');
      createCamera({
        organization_id: this.camera.organization_id,
        name: this.camera.name,
        mode: this.camera.mode,
        field_notes: this.camera.fieldNotes,
        latitude: parseFloat(lat_lon[0]),
        longitude: parseFloat(lat_lon[1]),
        deployment_date: this.camera.datesDeployed.start.toISOString(),
        collection_date: this.camera.datesDeployed.end.toISOString(),
      })
        .then(res => {
          $router.push({name: 'camera', params: {cameraId: res.data.id}});
          // $router.push(); // head off to the camera site...
        })
        .catch(res => {});
    },
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
  },

  mounted() {},
};
</script>

<style>
.spacer {
  display: block;
  height: 25px;
}
.notes {
  border: 1px solid #000000;
}
.date-picker input {
  display: block !important;
  width: 100% !important;
  color: #495057 !important;
  background-color: #fff !important;
  background-clip: padding-box !important;
  border: 1px solid #000000 !important;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
  padding: 0.25rem 0.5rem !important;
  padding-left: 15px !important;
  font-size: 1rem !important;
  color: #000000 !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important;
  line-height: 1.5 !important;
  border-radius: 0.2rem !important;
}
</style>
