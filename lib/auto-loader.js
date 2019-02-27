const fs = require('fs');
const path = require('path');

const config = global.vusionConfig;
const libraryPath = path.resolve(process.cwd(), config.libraryPath); // 旧的 components 目录
const srcPath = path.resolve(process.cwd(), config.srcPath);

const defaults = require('./defaults');
const _ = require('./utils');

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    // const params = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : {};

    this.cacheable();
    // 动态监听目录变化
    this.addContextDependency(libraryPath);
    // @TODO: 动态监听配置变化
    this.addDependency(config.configPath);
    this.addDependency(config.packagePath);

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

    // 动态生成组件、区块、指令、过滤器、工具
    // @compat:
    let componentsPath = path.join(libraryPath, 'components');
    if (!fs.existsSync(componentsPath))
        componentsPath = libraryPath;
    const components = _.getMaterials(componentsPath, config.docs && config.docs.components, 'components');
    _.setChildren(flatRoutesList[0]['/components'], components);

    let blocksPath = path.join(srcPath, 'blocks');
    const blocks = _.getMaterials(blocksPath, config.docs && config.docs.blocks, 'blocks');
    let directivesPath = path.join(srcPath, 'directives');
    const directives = _.getMaterials(directivesPath, config.docs && config.docs.directives, 'directives');
    let filtersPath = path.join(srcPath, 'filters');
    const filters = _.getMaterials(filtersPath, config.docs && config.docs.filters, 'filters');
    let utilsPath = path.join(srcPath, 'utils');
    const utils = _.getMaterials(utilsPath, config.docs && config.docs.utils, 'utils');

    const misc = [].concat(directives, filters, utils);
    _.setChildren(flatRoutesList[0]['/misc'], misc);

    const outputs = [];
    const $docs = Object.assign({}, defaults, config.docs, {
        componentGroups: _.groupMaterials(components),
        miscGroups: _.groupMaterials(misc),
    });
    outputs.push('const $docs = ' + JSON.stringify($docs));
    outputs.push('$docs.routes = ' + _.renderRoutes(routes));
    outputs.push('export default $docs');
    return outputs.join(';\n');
};
