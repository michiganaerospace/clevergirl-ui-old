<template>

  <SmScrollBox class="w-full h-full mx-10" >
  <template #header>
    <h3>Organizations [{{user.organizations.length}}]</h3>
    <router-link
      to="/camera-upload"
      @click.native='$store.dispatch("logout")'
      class="ml-auto inline-flex items-center"
      >
      Logout
      <SmIcon name="upload" size="s" class="ml-2" />
    </router-link>
  </template>

  <SmCard
    v-for='(org, index) in user.organizations'
    v-bind:key="org.id"
    :title='org.name'
    :sidetitle='activeStatus(org.id)' class='org-box' >
    {{org.description}} <a v-if='org.id != activeOrganizationId' @click='handleClick(org.id)'>
      Activate
    </a>
  </SmCard>

  </SmScrollBox>
</template>

<script>
// import Component from "../component_location"

export default {
  components: {},

  props: [],

  data() {
    return {
      activeId: null,
    };
  },

  watch: {},

  methods: {
    handleClick(orgId) {
      console.log(orgId)
      this.setActiveOrganization(orgId)
      this.$store.dispatch('getActiveOrganization')
    },
    setActiveOrganization(activeId) {
      localStorage.setItem('activeOrganizationId', activeId);
    },
    activeStatus(orgId) {
      if (orgId == this.activeOrganizationId) {
        return 'active';
      } else {
        return 'inactive';
      }
    },
    command(orgId) {
      if (orgId == this.activeOrganizationId) {
        return 'Deactivate';
      } else {
        return 'Activate';
      }
    },
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
    activeOrganizationId() {
      return this.$store.state.activeOrgId;
    },
  },

  mounted() {},
};
</script>

<style>
.org-box {
  width: 400px;
}
.activate {
  margin-top: 25px;
}
</style>
