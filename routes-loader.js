const path = require('path');
const globby = require('globby');

const config = global.vusionConfig;
const libraryPath = path.resolve(process.cwd(), config.libraryPath);

const kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    this.cacheable();
    // 动态监听目录变化
    this.addContextDependency(libraryPath);

    const filepaths = globby.sync(['*.vue/README.md'], { cwd: libraryPath });
    const routes = filepaths.map((filepath) => {
        const vueName = filepath.slice(0, -14);
        const markdownPath = path.resolve(libraryPath, filepath);
        return {
            name: vueName,
            path: markdownPath.replace(/\\/g, '/'),
        };
    });

    if (config.baseCSSPath) {
        let baseCSSPath = path.resolve(process.cwd(), config.baseCSSPath);
        baseCSSPath = baseCSSPath.replace(/\\/g, '/');
        content = `import '${baseCSSPath}';\n` + content;
    }

    return content.replace('/* Insert routes here */', routes.map((route) => {
        const meta = {
            name: kebab2Camel(route.name.slice(2)),
        };
        return `{ path: '${route.name}', component: () => import('${route.path}'), meta: ${JSON.stringify(meta)} }`;
    }).join(',\n'));
};
