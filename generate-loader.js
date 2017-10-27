const path = require('path');

const config = global.vusionConfig;
const srcPath = path.resolve(process.cwd(), config.libraryPath);
const globby = require('globby');
// 生成router.js 的内容 通过字符串拼接的形式
module.exports = function(content) {
    let str;
    const files = ['*/README.md'];
    const filepaths = globby.sync(files, { cwd: srcPath });
    const routeFiles = [];
    filepaths.forEach((item) => {
        const vueName = item.slice(0, -14);
        const markdownPath = path.resolve(srcPath, item);
        const obj = {
            name: vueName,
            path: markdownPath,
        };
        routeFiles.push(obj);
    });
    str = `import Vue from 'vue';
                import Layout from '../views/layout.vue';
                import Index from '../views/index.vue';
                import Components from '../views/components.vue';

                export default [
                    { path: '/', component: Layout, children: [
                        { path: '', component: Index, redirect: '/components' },
                        { path: 'components', component: Components, children: [
                            { path: '', redirect: 'u-link' },\n`;
    routeFiles.forEach((item) => {
        let name = item.name.replace(/-/g, '').slice(1);
        name = name[0].toUpperCase() + name.slice(1);
        str += `{ path: '${item.name}', component: () => import('${item.path}'), meta: '${name}' },\n`;
    });
    str += `] },
            ] },
            { path: '*', redirect: '/components' },
        ]`;
    str = str.replace(/\\/g, '/');
    return str;
};