<template>
  <SmCard :title="mode">
    <form @submit.prevent="signUpLogin">
      <label for="email">Email</label>
      <div v-if="invalidEmail" class="invalid email ml-auto">
        Invalid Email.
      </div>
      <input id="email" type="email" v-model="email" @keyup="check('email')" />
      <label for="password">Password</label>
      <div v-if="invalidPassword" class="invalid pw ml-auto">
        Invalid Password.
      </div>
      <input
        id="password"
        type="password"
        v-model="password"
        @keyup="check('password')"
      />
      <div>
        <SmButton kind="primary" class="mt-5 mb-4 mx-auto">
          {{ mode }}
        </SmButton>
        <SmButton
          kind="alternate"
          type="button"
          @click="toggleMode"
          class="mx-auto"
        >
          {{ mode === "Login" ? "Sign Up" : "Back to Login" }}
        </SmButton>
      </div>
    </form>
  </SmCard>
</template>

<script>
import postSignupLogin from '../api/postSignupLogin.js';

export default {
  data: function() {
    return {
      mode: 'Login',
      email: 'mlewis@michaero.com',
      password: 'largos',
      invalidPassword: false,
      invalidEmail: false,
    };
  },

  methods: {
    logout: function() {
      this.$store.commit('logout');
      this.$emit('hide');
    },

    toggleMode: function() {
      if (this.mode === 'Login') {
        this.mode = 'Sign Up';
      } else {
        this.mode = 'Login';
      }
      this.invalidPassword = false;
      this.invalidEmail = false;
      document.getElementById('email').setCustomValidity('');
      document.getElementById('password').setCustomValidity('');
    },

    check: function(inputId) {
      if (inputId == 'password') {
        if (this.password == '') {
          document
            .getElementById(inputId)
            .setCustomValidity('Incorrect password.');
          this.invalidPassword = true;
        } else {
          document.getElementById(inputId).setCustomValidity('');
          this.invalidPassword = false;
        }
      } else {
        if (this.email == '') {
          document
            .getElementById(inputId)
            .setCustomValidity('Incorrect email.');
          this.invalidEmail = true;
        } else {
          document.getElementById(inputId).setCustomValidity('');
          this.invalidEmail = false;
        }
      }
    },

    setToken: function(token) {
      console.log('Setting token.');
      localStorage.setItem('token', token);
      location.reload();
    },

    signUpLogin: function() {
      this.$emit('hide');
      const CREDS = {
        email: this.email,
        password: this.password,
      };

      postSignupLogin(CREDS, this.mode)
        .then(res => {
          console.log(this);
          console.log(res);
          var token = res.data.access_token;
          this.setToken(res.data.access_token);
        })
        .catch(error => {
          if (this.mode == 'Login') {
            document
              .getElementById('email')
              .setCustomValidity(error.response.data.detail);
            document
              .getElementById('password')
              .setCustomValidity(error.response.data.detail);
            this.invalidEmail = true;
            this.invalidPassword = true;
          } else {
            if (
              error.response.data.detail == 'Email already exists in system.'
            ) {
              document
                .getElementById('email')
                .setCustomValidity(error.response.data.detail);
              this.invalidEmail = true;
            }
          }
        });

      if (false) {
        postSignupLogin(CREDS, this.mode).then(res => {
          if (res.errors) {
            if (res.errors[0].message == 'Incorrect password.') {
              document
                .getElementById('password')
                .setCustomValidity('Incorrect password.');
              this.invalidPassword = true;
            } else {
              document
                .getElementById('email')
                .setCustomValidity('Incorrect email.');
              this.invalidEmail = true;
            }
          } else {
            const dt = this.mode === 'Login' ? 'login' : 'createUser';
            this.setToken(JSON.stringify(res.data[dt].user.token));
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.invalid {
  color: red;
  font-size: small;
  position: absolute;
  right: 10px;
}
.pw {
  top: 105px;
}
.email {
  top: 25px;
}
</style>
