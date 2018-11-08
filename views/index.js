import Vue from 'vue';
import VueRouter from 'vue-router';
import * as ProtoUI from 'proto-ui.vusion';
import * as Library from 'library';
import { install } from 'vusion-utils';
Vue.use(VueRouter);

import 'baseCSS';

// 自动注册本地组件
const requires = require.context('../components/', true, /\.vue$/);
requires.keys().forEach((key) => {
    if (key.indexOf('.vue') !== key.lastIndexOf('.vue'))
        return;
    const name = requires(key).default.name || key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
    Vue.component(name, requires(key).default);
});

install(ProtoUI, Vue);
install(Library, Vue);

/* eslint-disable no-undef */
if (DOCS_COMPONENTS_PATH) {
    const requires2 = require.context(DOCS_COMPONENTS_PATH, true, /\.vue$/);
    requires2.keys().forEach((key) => {
        if (key.indexOf('.vue') !== key.lastIndexOf('.vue'))
            return;
        const name = requires2(key).default.name || key.slice(key.lastIndexOf('/') + 1, key.lastIndexOf('.'));
        Vue.component(name, requires2(key).default);
    });
}

// 使用 routes-loader 解析 routes 文件
import $docs from '../lib/auto-loader!./empty';
Vue.prototype.$docs = $docs;
Vue.prototype.NODE_ENV = process.env.NODE_ENV;

document.title = $docs.title || 'Vusion 组件库';

{
    Vue.mixin({
        data() {
            return {
                codeExampleDemoVM: undefined,
            };
        },
        created() {
            this.$contact('u-code-example-demo', (codeExampleDemoVM) => {
                this.codeExampleDemoVM = codeExampleDemoVM;
                if (this.$options._componentTag && this.$options._componentTag.startsWith('anondemo-'))
                    codeExampleDemoVM.anondemoVM = this;
            });
            this.codeExampleDemoVM && this.codeExampleDemoVM.flush();
        },
        updated() {
            this.codeExampleDemoVM && this.codeExampleDemoVM.flush();
        },
        methods: {
            $contact(condition, callback) {
                if (typeof condition === 'string') {
                    const name = condition;
                    condition = ($parent) => $parent.$options.name === name;
                }

                let $parent = this.$parent || this.$root;
                while ($parent && !condition($parent))
                    $parent = $parent.$parent;

                $parent && callback($parent);
            },
        },
    });

    const logEvent = function (eventName, payload) {
        if (!this.$vnode)
            return;
        const context = this.$vnode.context;
        if (this.codeExampleDemoVM && !eventName.startsWith('hook:')
            && (context === this.codeExampleDemoVM.$vnode.context
                || context.$options._componentTag && context.$options._componentTag.startsWith('anondemo-')))
            this.codeExampleDemoVM.logEvent(this, eventName, payload);
    };

    const oldEmit = Vue.prototype.$emit;
    Vue.prototype.$emit = function (...args) {
        const ret = oldEmit.apply(this, args);
        logEvent.call(this, args[0], args.slice(1));
        return ret;
    };
}

new Vue({
    router: new VueRouter({
        mode: $docs.mode,
        base: $docs.base,
        routes: $docs.routes,
        scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
    }),
}).$mount('#app');
