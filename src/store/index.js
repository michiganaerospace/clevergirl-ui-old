import Vue from 'vue';
import Vuex from 'vuex';
import {constructRequest} from '@/api.js';
import {hideMenu, showMenu} from '@/utils.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {organizations: []},
    loggedIn: false,
    activeOrgId: 1,
  },

  mutations: {
    logout: function() {
      localStorage.removeItem('token');
      loggedIn: false;
      hideMenu();
      $router.push('/login');
    },

    removeUser: function(state) {
      localStorage.removeItem('token');
      state.loggedIn = false;
      hideMenu();
      state.user = {};
    },

    setUser: function(state, user) {
      state.user = user;
      state.loggedIn = true;
      console.log('Welcome, ' + user.email);
      showMenu();
      if ($router.currentRoute.name == 'login') {
        console.log('PUSHING');
        $router.push('/');
      }
    },

    setActiveOrgId(state, orgId) {
      state.activeOrgId = orgId;
    },
  },

  actions: {
    logout(context) {
      context.commit('logout');
    },

    getCurrentUser(context) {
      var request = constructRequest('/users/me', 'get');
      axios(request)
        .then(res => {
          context.commit('setUser', res.data);
          showMenu();
        })
        .catch(err => {
          console.log('Logging out!');
          context.commit('removeUser');
          hideMenu();
        });
    },

    getActiveOrganization(context) {
      var activeOrgId = localStorage.getItem('activeOrganizationId');
      context.commit('setActiveOrgId', activeOrgId);
    },
  },

  modules: {},
});
