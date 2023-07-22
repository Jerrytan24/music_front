import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/store.js'
import VueLazyload from 'vue-lazyload'
import ElementUI from 'element-ui';
import VEmojiPicker from 'v-emoji-picker';
import Header from '@/components/header/Header.vue'
import Swiper from "@/components/swiper/Swiper.vue";
import "element-ui/lib/theme-chalk/index.css";
import '@/assets/css/common.css'


Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VEmojiPicker);
Vue.use(VueLazyload, {
  error: require('@/assets/error.webp'),
  loading: require('@/assets/loading.gif'),
  attempt: 1
})
Vue.component('Header', Header);
Vue.component('Swiper', Swiper);
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
