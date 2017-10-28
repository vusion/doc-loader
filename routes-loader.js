const path = require('path');

const config = global.vusionConfig;
const libraryPath = path.resolve(process.cwd(), config.libraryPath);
const globby = require('globby');

const kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    this.cacheable();

    const filepaths = globby.sync(['*/README.md'], { cwd: libraryPath });
    const routes = filepaths.map((filepath) => {
        const vueName = filepath.slice(0, -14);
        const markdownPath = path.resolve(libraryPath, filepath);
        return {
            name: vueName,
            path: markdownPath.replace(/\\/g, '/'),
        };
    });

    return content.replace('/* Insert routes here */', routes.map((route) => {
        const meta = {
            name: kebab2Camel(route.name.slice(2)),
        };
        return `{ path: '${route.name}', component: () => import('${route.path}'), meta: ${JSON.stringify(meta)} }`;
    }).join(',\n'));
};
