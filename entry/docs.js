import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Library from 'library';
import * as Cmpts from '../components';
import { installComponents } from 'vusion-utils';
Vue.use(VueRouter);

const Components = Object.assign({}, Cmpts, Library);

installComponents(Components, Vue);

// 使用vusion-doc-loader 中的routes-loader 解析routes文件 得到想要的内容
import routes from '../routes-loader!./routes';

new Vue({
    router: new VueRouter({
        base: window.base,
        routes,
        scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
    }),
}).$mount('#app');
