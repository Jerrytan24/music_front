import Vue from 'vue'
import Vuex from 'vuex'
import song from '@/store/myVedio.js'
import index from '@/store/index.js'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        song,
        index
    }
}
)