// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'babel-polyfill'
// import store from './store' //vuex存储文件
// eslint-disable-next-line no-unused-vars
import $ from 'jquery'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'css/index.styl'
import axios_ from './api/http' // axios封装
import Common from 'js/common' // 公共js

Vue.prototype.axios = axios_; // 挂载到Vue实例上面
Vue.config.productionTip = false;

Vue.use(Common).use(ElementUI);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    // store,
    components: { App },
    template: '<App/>'
})
