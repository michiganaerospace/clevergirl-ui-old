import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import components from '@springmatter/components';
import axios from 'axios';
import VCalendar from 'v-calendar';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import Toasted from 'vue-toasted';
import * as VueGoogleMaps from 'vue2-google-maps';
import VModal from 'vue-js-modal'

for (let c of components) {
  Vue.component(c.name, c);
}
Vue.component('v-date-picker', DatePicker);
Vue.use(Toasted);
Vue.use(VModal, {dialog: true})


Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCK_US15dtuDvMhJz_RBf7iAHFQ6Vz7c7M',
    libraries: 'places, visualization'
  },
  installComponents: true
});

Vue.config.productionTip = false;
window.axios = axios;
window.$router = router;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
