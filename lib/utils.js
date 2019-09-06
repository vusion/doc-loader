const fs = require('fs');
const path = require('path');
const globby = require('globby');

const kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

function createRoute(routePath, flatRoutes) {
    if (!routePath)
        routePath = '/';
    if (flatRoutes[routePath])
        return flatRoutes[routePath];

    let [m, parentPath, currentPath] = routePath.match(/(.*)\/(.*)/);
    if (routePath === '/')
        currentPath = '/';
    if (!parentPath)
        parentPath = '/';

    return flatRoutes[routePath] = {
        path: currentPath,
        parentPath,
        routePath,
    };
}

exports.getFlatRoutes = function (basePath) {
    // 这里本可以直接在递归目录时生成每一级路由
    // 但现在采用的是获取所有扁平化路由，是为了方便配置扩展
    const flatRoutes = {};
    globby.sync(['**/*.{vue,md}'], { cwd: basePath }).forEach((filePath) => {
        filePath = filePath.replace(/\\/g, '/');
        const routePath = ('/' + filePath).replace(/(\/index)?\.(vue|md)$/, '') || '/';

        const route = createRoute(routePath, flatRoutes);
        route.filePath = filePath;
        route.fullPath = path.join(basePath, filePath);
    });

    return flatRoutes;
};

const _mergeFlatRoutes = function (routes1, routes2) {
    if (!routes2)
        return routes1;
    Object.keys(routes2).forEach((key) => {
        routes1[key] = routes1[key] ? Object.assign(routes1[key], routes2[key]) : routes2[key];
    });
    return routes1;
};
exports.mergeFlatRoutes = (...args) => args.reduceRight((acc, cur) => _mergeFlatRoutes(cur, acc));

exports.nestRoutes = function (flatRoutes) {
    const routes = [];

    const parse = function (route) {
        if (route.routePath === '/')
            return;

        let parent = flatRoutes[route.parentPath];
        if (!parent) {
            parent = createRoute(route.parentPath, flatRoutes);
            parent.fullPath = parent.filePath = require.resolve('proto-ui.vusion/src/layouts/l-wrapper.vue/index.js').replace(/\\/g, '/');
            parse(parent);
        }

        parent.children = parent.children || [];
        parent.children.push(route);
    };

    Object.keys(flatRoutes).forEach((key) => parse(flatRoutes[key]));
    // 补充
    Object.keys(flatRoutes).forEach((key) => {
        const route = flatRoutes[key];
        if (route.children && !!route.children[0].path)
            route.children.unshift({ path: '', redirect: route.children[0].path });
    });
    routes.push(flatRoutes['/'], { path: '*', redirect: '/' });

    return routes;
};

exports.renderRoutes = function (routes) {
    return '[\n' + routes.map((route) => {
        const properties = [];
        properties.push(`path: '${route.path}'`);
        /* eslint-disable multiline-ternary */
        route.fullPath && properties.push(route.chunkName
            ? `component: () => import(/* webpackChunkName: "${route.chunkName}" */ '${route.fullPath.replace(/\\/g, '/')}')`
            : `component: require('${route.fullPath.replace(/\\/g, '/')}').default`);
        route.children && properties.push(`children: ${exports.renderRoutes(route.children)}`);
        route.redirect && properties.push(`redirect: '${route.redirect}'`);
        route.alias && properties.push(`alias: '${route.alias}'`);
        return `{ ${properties.join(', ')} }`;
    }).join(',\n') + '\n]\n';
};

exports.getMaterials = function (basePath, materials, type) {
    const isComponentsType = type === 'components' || type === 'vendor' || type === 'layouts';

    if (!materials) { // 如果配置中没有 materials，则根据目录来生成
        if (isComponentsType) {
            const materialsMap = {};

            // 目录中的组件
            globby.sync(['*.vue'], { cwd: basePath })
                .forEach((filePath) => {
                    const vueName = filePath.slice(0, -4);
                    const markdownPath = path.resolve(basePath, filePath + '/README.md').replace(/\\/g, '/');
                    materialsMap[vueName] = {
                        name: vueName,
                        path: markdownPath,
                    };
                });

            materials = Object.keys(materialsMap).map((vueName) => materialsMap[vueName]);
        } else
            return [];
    }

    materials.forEach((material) => {
        const relativeReadmePath = (material.scope ? `@${material.scope}/` : '') + material.name + (isComponentsType ? '.vue/README.md' : '/README.md');

        if (material.path) {
            if (material.path[0] === '.')
                material.path = path.join(process.cwd(), material.path).replace(/\\/g, '/');
            else {
                // @compat:
                let libraryPath = basePath;
                if (basePath.endsWith(type))
                    libraryPath = path.dirname(basePath);
                material.path = material.path.replace(/^library/, libraryPath).replace(/^@/, process.cwd());
            }
        } else if (!material.href && !material.to)
            material.path = path.resolve(basePath, relativeReadmePath).replace(/\\/g, '/');

        if (material.path) {
            // 只验证完整路径
            if (path.isAbsolute(material.path) && !fs.existsSync(material.path)) {
                material.path = '';
                // @TODO: 临时解决方案，一般只从 proto-ui 中扩展
                let depMarkdownPath;
                if (type !== 'vendor')
                    depMarkdownPath = path.resolve(basePath, `../../node_modules/proto-ui.vusion/src/${type}/` + relativeReadmePath).replace(/\\/g, '/');
                else
                    depMarkdownPath = path.resolve(basePath, `../../node_modules/proto-ui.vusion/node_modules/` + relativeReadmePath).replace(/\\/g, '/');
                if (fs.existsSync(depMarkdownPath))
                    material.path = depMarkdownPath;
            }

            // subDocs
            const subDocsPath = path.resolve(material.path, '../docs');
            if (fs.existsSync(subDocsPath)) {
                material.children = fs.readdirSync(subDocsPath).map((name) => ({
                    path: name.replace(/\.md$/, ''),
                    fullPath: path.resolve(subDocsPath, name),
                }));
                if (material.children && material.children[0] && !!material.children[0].path) {
                    if (material.children.find((route) => route.path === 'examples'))
                        material.children.unshift({ path: '', redirect: 'examples' });
                    else
                        material.children.unshift({ path: '', redirect: material.children[0].path });
                }
            }
        }

        material.CamelName = kebab2Camel(material.name); // .replace(/^u-/, ''));
    });

    return materials;
};

exports.groupMaterials = function (materials) {
    const groupsMap = {};
    materials.forEach((material) => {
        material.group = material.group || '';
        if (!groupsMap[material.group])
            groupsMap[material.group] = { name: material.group, children: [] };
        groupsMap[material.group].children.push(material);
    });
    return Object.keys(groupsMap).map((key) => groupsMap[key]);
};

exports.setChildren = function (route, materials) {
    route.children = materials.filter((material) => !!material.path).map((material) => ({
        path: material.name,
        fullPath: material.path,
        children: material.children,
        chunkName: (material.group || '').replace(/\s+/g, '_'),
    }));
    // 添加默认跳转路径
    if (route.children && route.children[0] && !!route.children[0].path)
        route.children.unshift({ path: '', redirect: route.children[0].path });
};
