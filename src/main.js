import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import Vuex from 'vuex'
import 'ant-design-vue/dist/antd.css';
import store from './store/'
import router from './router'
import VueLogger from 'vuejs-logger';
const isProduction = process.env.NODE_ENV === 'production';
import './components'
import VueStorage from 'vue-ls'
import {ACCESS_TOKEN} from "@/store/mutation-type";

const options = {
  isEnabled: true,
  logLevel : isProduction ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

const config = {
  storageOptions: {
    namespace: 'nakiru__',
    name: 'ls',
    storage: 'local'
  }
}

Vue.use(VueLogger, options);
Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(Vuex)
Vue.use(router)
Vue.use(VueStorage, config.storageOptions)

store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
