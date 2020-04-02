<template>

  <SmScrollBox class="w-full h-full mx-10" >
    <template #header>
      <input
        type="search"
        placeholder="Search"
        v-model="searched"
        maxlength="32"
        class="inline"
      />
      <router-link
        to="/camera-upload"
        @click.native='logout'
        class="ml-auto inline-flex items-center"
      >
        Logout
        <SmIcon name="log-out" size="s" class="ml-2" />
      </router-link>
    </template>
    <h4>Application Settings</h4>
  </SmScrollBox>
</template>

<script>
// import Component from "../component_location"

export default {
  components: {},

  props: [],

  data() {
    return {
      searched: '',
    };
  },

  watch: {},

  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },

  computed: {},

  mounted() {},
};
</script>

<style>
</style>
