import Vue from 'vue'
import store from '../store/index.js'
import VueRouter from 'vue-router'
import Index from '@/views/Index.vue'
import Singer from '@/views/Singer.vue'
import SongList from '@/views/SongList.vue'
import Favor from '@/views/Favor.vue'
import Login from '@/views/Login.vue'
import Search from '@/views/Search.vue'
import Detail from '@/views/Detail.vue'
import HomePage from '@/views/HomePage.vue'
import DynamicSquare from '@/views/DynamicSquare.vue'
import EditMySelf from '@/views/EditMySelf.vue'
import SongListDetail from '@/views/SongListDetail.vue'
import SingerListDetail from '@/views/SingerListDetail.vue'
import Logup from '@/views/Logup.vue'
import Error from '@/views/Error.vue'


Vue.use(VueRouter)

const routes = [
  // 重定向的路由规则
  { path: '/', redirect: '/index' },
  // 路由规则
  { path: '/login', component: Login },
  { path: '/index', component: Index },
  { path: '/singer', component: Singer },
  { path: '/songList', component: SongList },
  { path: '/favor', component: Favor },
  { path: '/search', component: Search },
  { path: '/detail', component: Detail },
  { path: '/home', component: HomePage },
  { path: '/dynamicSquare', component: DynamicSquare },
  { path: '/edit', component: EditMySelf },
  { path: '/songListDetail', component: SongListDetail },
  { path: '/home1', component: HomePage },
  { path: '/singerListDetail', component: SingerListDetail },
  { path: '/logup', component: Logup },
  { path: '*', component: Error },
]

const router = new VueRouter({
  routes,
  mode: 'history',
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.path != '/favor' && to.path != '/home' && to.path != "/edit") {
    next();
  } else {
    let token = localStorage.getItem('token');
    if (token === null || token === '') {
      store.state.errorMsg = "请登陆后操作";
      next('/login');
    } else {
      next();
    }
  }
});
export default router
