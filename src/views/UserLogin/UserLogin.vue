<template>

  <div class="flex items-center justify-center w-full h-full -mt-10">
    <div class="w-1/3 mr-5">
      <h6>Welcome to</h6>
      <h1 class="text-bold">CLEVERGIRL</h1>
      <p>
        CLEVERGIRL is a platform for analyzing camera trap images using modern
        machine learning technologies.
      </p>
    </div>
    <LoginForm class="w-1/3" />
  </div>

</template>

<script>
import LoginForm from './components/LoginForm.vue';

export default {
  name: 'loginView',
  components: {LoginForm},
  data: function() {
    return {
      hidden: true,
      mode: 'Sign up',
    };
  },
  methods: {
    signUpLogin: function() {
      if (this.mode === 'Login') {
        this.mode = 'Sign up';
      } else {
        this.mode = 'Login';
      }
    },
  },
  mounted() {}
};
</script>

<style scoped>
</style>
