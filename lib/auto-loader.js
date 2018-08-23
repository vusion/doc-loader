const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const config = global.vusionConfig;
const libraryPath = path.resolve(process.cwd(), config.libraryPath);

const _ = require('./utils');

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    const params = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {};
    console.log(this.resourceQuery, params);

    this.cacheable();
    // 动态监听目录变化
    this.addContextDependency(libraryPath);
    // @TODO: 动态监听配置变化
    // this.addDependency();

    // 动态生成路由
    const docLoaderViewsPath = path.resolve(__dirname, '../views');
    this.addContextDependency(docLoaderViewsPath);
    const flatRoutesList = [_.getFlatRoutes(docLoaderViewsPath)];
    const cwdViewsPath = path.resolve(process.cwd(), 'docs/views');
    if (fs.existsSync(cwdViewsPath)) {
        this.addContextDependency(cwdViewsPath);
        flatRoutesList.push(_.getFlatRoutes(cwdViewsPath));
    }
    if (config.docs && config.docs.routes)
        flatRoutesList.push(config.docs.routes);

    const routes = _.nestRoutes(_.mergeFlatRoutes(...flatRoutesList));

    // 动态生成组件
    const components = _.getComponents(libraryPath, config.docs && config.docs.components);
    // 如果要 components 则直接返回
    if (params.components) {
        return 'export default ' + JSON.stringify(_.groupComponents(components));
    }

    content = '';
    if (config.baseCSSPath) {
        let baseCSSPath = path.resolve(process.cwd(), config.baseCSSPath);
        baseCSSPath = baseCSSPath.replace(/\\/g, '/');
        if (!fs.existsSync(baseCSSPath))
            baseCSSPath = '../components/base/base.css';
        content = `import '${baseCSSPath}';\n`;
    }

    flatRoutesList[0]['/components'].children = components.map((component) => ({ path: component.name, fullPath: component.path }));

    content += 'export default ' + _.renderRoutes(routes);
    return content;
};
