import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"

import axios from 'axios'

import './axios'
import './permission'
import VueParticles from 'vue-particles'
Vue.use(VueParticles)
Vue.use(Element)

Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


