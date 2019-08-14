const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const defaults = require('./defaults');
const _ = require('./utils');

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    const config = loaderUtils.getOptions(this);
    const srcPath = config.srcPath;
    const libraryPath = config.libraryPath;

    this.cacheable();
    // 动态监听目录变化
    this.addContextDependency(srcPath || libraryPath);
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
    flatRoutesList[0]['/components'] && _.setChildren(flatRoutesList[0]['/components'], components);

    const vendorPath = path.resolve(process.cwd(), 'packages');
    const vendor = _.getMaterials(vendorPath, config.docs && config.docs.vendor, 'vendor');
    flatRoutesList[0]['/vendor'] && _.setChildren(flatRoutesList[0]['/vendor'], vendor);

    const blocksPath = path.join(srcPath, 'blocks');
    const blocks = _.getMaterials(blocksPath, config.docs && config.docs.blocks, 'blocks');
    flatRoutesList[0]['/blocks'] && _.setChildren(flatRoutesList[0]['/blocks'], blocks);

    const directivesPath = path.join(srcPath, 'directives');
    const directives = _.getMaterials(directivesPath, config.docs && config.docs.directives, 'directives');
    const filtersPath = path.join(srcPath, 'filters');
    const filters = _.getMaterials(filtersPath, config.docs && config.docs.filters, 'filters');
    const utilsPath = path.join(srcPath, 'utils');
    const utils = _.getMaterials(utilsPath, config.docs && config.docs.utils, 'utils');

    const misc = [].concat(directives, filters, utils);
    flatRoutesList[0]['/misc'] && _.setChildren(flatRoutesList[0]['/misc'], misc);

    const outputs = [];
    const $docs = Object.assign({}, defaults, config.docs, {
        theme: config.theme,
        componentGroups: _.groupMaterials(components),
        vendorGroups: _.groupMaterials(vendor),
        blocksGroups: _.groupMaterials(blocks),
        miscGroups: _.groupMaterials(misc),
    });
    outputs.push('const $docs = ' + JSON.stringify($docs));
    outputs.push('$docs.routes = ' + _.renderRoutes(routes));
    outputs.push('export default $docs');
    return outputs.join(';\n');
};
