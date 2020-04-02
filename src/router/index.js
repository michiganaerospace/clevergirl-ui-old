import Vue from 'vue';
import store from '../store';
import {verifyUser} from '@/api.js';
import VueRouter from 'vue-router';
import Landing from '../views/Landing.vue';
import Cameras from '../views/Cameras/Cameras.vue';
import UserLogin from '../views/UserLogin/UserLogin.vue';
import CameraCreate from '../views/CameraCreate/CameraCreate.vue';
import Camera from '../views/Camera/Camera.vue';
import Settings from '../views/Settings.vue';
import ListOrganizations from '../views/ListOrganizations/ListOrganizations.vue';
import Burst from '../views/Burst/Burst.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'landing',
    component: Landing,
  },
  {
    path: '/login',
    name: 'login',
    component: UserLogin,
  },
  {
    path: '/organizations',
    name: 'organizations',
    component: ListOrganizations,
  },
  {
    path: '/cameras',
    name: 'cameras',
    component: Cameras,
  },
  {
    path: '/camera-create',
    name: 'cameraCreate',
    component: CameraCreate,
  },
  {
    path: '/cameras/:cameraId',
    name: 'camera',
    component: Camera,
    props: true,
  },
  {
    path: '/cameras/:cameraId/bursts/:burstId',
    name: 'burst',
    component: Burst,
    props: true,
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
  },
];

const router = new VueRouter({
  routes,
});

// Guard the routes. Verify user is valid before navigation.
router.beforeEach((to, from, next) => {
  verifyUser()
    .then(next())
    .catch(res => {
      if (to.path != '/login') {
        next('/login');
      }
    });
});

export default router;
