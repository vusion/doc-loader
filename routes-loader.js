const fs = require('fs');
const path = require('path');
const globby = require('globby');

const config = global.vusionConfig;
const libraryPath = path.resolve(process.cwd(), config.libraryPath);

const kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

// const VusionDocLoader = require('./index');

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    this.cacheable();
    // 动态监听目录变化
    this.addContextDependency(libraryPath);

    const components = {};
    // 所有有文档的组件
    // Object.keys(VusionDocLoader.caches).forEach((vueName) => {
    //     const markdownPath = VusionDocLoader.caches[vueName].replace(/\\/g, '/');
    //     if (!fs.existsSync(markdownPath)) {
    //         delete VusionDocLoader.caches[vueName];
    //         return;
    //     }

    //     components[vueName] = {
    //         name: vueName,
    //         path: markdownPath,
    //         inProject: false,
    //     };
    // });

    // 目录中的组件
    globby.sync(['*.vue'], { cwd: libraryPath })
        .forEach((filePath) => {
            const vueName = filePath.slice(0, -4);
            const markdownPath = path.resolve(libraryPath, filePath + '/README.md').replace(/\\/g, '/');
            if (!fs.existsSync(markdownPath)) {
                if (components[vueName])
                    components[vueName].inProject = true;
            } else {
                components[vueName] = {
                    name: vueName,
                    path: markdownPath,
                    inProject: true,
                };
            }
        });

    if (config.baseCSSPath) {
        let baseCSSPath = path.resolve(process.cwd(), config.baseCSSPath);
        baseCSSPath = baseCSSPath.replace(/\\/g, '/');
        if (!fs.existsSync(baseCSSPath))
            baseCSSPath = '../components/base/base.css';
        content = `import '${baseCSSPath}';\n` + content;
    }

    const vueNames = Object.keys(components);
    if (!vueNames.length)
        return;

    return content.replace('/* Insert routes here */', [
        // 自动跳转到第一个
        `{ path: '', redirect: '${components[vueNames[0]].name}' }`,
    ].concat(vueNames.map((vueName) => {
        const component = components[vueName];

        const meta = {
            name: kebab2Camel(vueName.slice(2)),
            inProject: component.inProject,
        };
        return `{ path: '${component.name}', component: () => import('${component.path}'), meta: ${JSON.stringify(meta)} }`;
    })).join(',\n'));
};
