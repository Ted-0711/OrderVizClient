// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import 'element-theme-dark'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$echarts = window.echarts
Vue.use(require('vue-faker'), { locale: 'zh_CN' })
const faker = require('faker')
window.faker = faker

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App),
})
