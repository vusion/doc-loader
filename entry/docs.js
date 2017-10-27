import Vue from 'vue';
import VueRouter from 'vue-router';
import * as Library from 'library';
import { installComponents } from 'vusion-utils';
Vue.use(VueRouter);

import GlobalLayout from '../common/u-global-layout.vue';
import Article from '../common/u-article.vue';
import Logo from '../common/u-logo.vue';
import Navbar from '../common/u-navbar.vue';
import NavbarItem from '../common/u-navbar-item.vue';
import Sidebar from '../common/u-sidebar.vue';
import SidebarGroup from '../common/u-sidebar-group.vue';
import SidebarItem from '../common/u-sidebar-item.vue';
import SidebarMenu from '../common/u-sidebar-menu.vue';
// import ThemeSelect from '../common/u-theme-select.vue';
// import ThemeSelectItem from '../common/u-theme-select-item.vue';
import '../common/atom-one-light.css';

const Components = Object.assign({}, Library, {
    GlobalLayout,
    Article,
    Logo,
    Navbar,
    NavbarItem,
    Sidebar,
    SidebarGroup,
    SidebarItem,
    SidebarMenu,
    // ThemeSelect,
    // ThemeSelectItem,
});

installComponents(Components, Vue);

// 使用vusion-doc-loader 中的routes-loader 解析routes文件 得到想要的内容
import routes from '../generate-loader!./routes';

new Vue({
    router: new VueRouter({
        base: window.base,
        mode: 'history',
        routes,
        scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
    }),
}).$mount('#app');