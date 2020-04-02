<template>
  <SmApp :links="links" :logoSrc="logoSrc" />
</template>

<script>
// import Component from "../component_location"
import Logo from './assets/2x/logo@2x.png';

export default {
  components: {},

  props: [],

  data() {
    return {
      logoSrc: Logo,
      links: [
        {icon: 'home', route: '/organizations'},
        {icon: 'camera', route: '/cameras'},
      ],
    };
  },

  watch: {},

  methods: {},

  computed: {},

  mounted() {
    this.$store.dispatch('getCurrentUser');
    this.$store.dispatch('getActiveOrganization')
  },
};
</script>

<style>
</style>
