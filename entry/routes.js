import Vue from 'vue';
import Layout from '../views/layout.vue';
import Index from '../views/index.vue';
import Components from '../views/components.vue';

export default [
    { path: '/', component: Layout, children: [
        { path: '', component: Index, redirect: '/components' },
        { path: 'components', component: Components, children: [
            /* Insert routes here */
        ] },
    ] },
    { path: '*', redirect: '/components' },
];
