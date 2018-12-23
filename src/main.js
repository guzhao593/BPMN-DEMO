import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
/* 左边工具栏以及编辑节点的样式 */
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
/* 右边工具栏样式 */
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
