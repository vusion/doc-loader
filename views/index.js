import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Library from 'library';
import * as Cmpts from '../components';
import { installComponents } from 'vusion-utils';
Vue.use(VueRouter);

const Components = Object.assign({}, Cmpts, Library);

installComponents(Components, Vue);

// 使用 routes-loader 解析 routes 文件
import routes from '../lib/auto-loader!./routes';

new Vue({
    router: new VueRouter({
        base: window.base,
        routes,
        scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
    }),
}).$mount('#app');
