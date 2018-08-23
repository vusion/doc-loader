const fs = require('fs');
const path = require('path');
const globby = require('globby');

const kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

exports.getFlatRoutes = function (basePath) {
    // 这里本可以直接在递归目录时生成每一级路由
    // 但现在采用的是获取所有扁平化路由，是为了方便配置扩展
    const flatRoutes = {};
    globby.sync(['**/*.{vue,md}'], { cwd: basePath }).forEach((filePath) => {
        filePath = filePath.replace(/\\/g, '/');
        const routePath = ('/' + filePath).replace(/(\/index)?\.vue$/, '') || '/';
        let [m, parentPath, currentPath] = routePath.match(/(.*)\/(.*)/);
        if (routePath === '/')
            currentPath = '/';
        if (!parentPath)
            parentPath = '/';
        flatRoutes[routePath] = {
            path: currentPath,
            parentPath,
            routePath,
            filePath,
            fullPath: path.join(basePath, filePath),
        };
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
        // let [m, parentKey, current] = key.match(/(.*)\/(.*)/);
        // route.path = current;
        // if (!parentKey)
        //     parentKey = '/';

        let parent = flatRoutes[route.parentPath];
        if (!parent) {
            parent = flatRoutes[route.parentPath] = { path: '/', routePath: '/' };
            parse(route.parentPath);
        }

        parent.children = parent.children || [];
        parent.children.push(route);
    };
    // if (!keys.includes('/'))
    //     flatRoutes['/'] = { path: '/', routePath: '/' };

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
        route.fullPath && properties.push(`component: require('${route.fullPath}').default`);
        route.children && properties.push(`children: ${exports.renderRoutes(route.children)}`);
        route.redirect && properties.push(`redirect: '${route.redirect}'`);
        route.alias && properties.push(`alias: '${route.alias}'`);
        return `{ ${properties.join(', ')} }`;
    }).join(',\n') + '\n]\n';
};

exports.getComponents = function (basePath, components) {
    if (!components) {
        const componentsMap = {};

        // 目录中的组件
        globby.sync(['*.vue'], { cwd: basePath })
            .forEach((filePath) => {
                const vueName = filePath.slice(0, -4);
                const markdownPath = path.resolve(basePath, filePath + '/README.md').replace(/\\/g, '/');
                componentsMap[vueName] = {
                    name: vueName,
                    path: markdownPath,
                };
            });

        components = Object.keys(componentsMap).map((vueName) => componentsMap[vueName]);
    }

    components.forEach((component) => {
        if (component.path)
            component.path = component.path.replace(/^library/, basePath).replace(/^@/, process.cwd());
        else
            component.path = path.resolve(basePath, component.name + '.vue/README.md').replace(/\\/g, '/');

        if (!fs.existsSync(component.path)) {
            component.path = '';
            // @TODO: 临时解决方案，一般只从 proto-ui 中扩展
            const depMarkdownPath = path.resolve(process.cwd(), 'node_modules/proto-ui.vusion/src/' + component.name + '.vue/README.md').replace(/\\/g, '/');
            if (fs.existsSync(depMarkdownPath))
                component.path = depMarkdownPath;
        }

        component.CamelName = kebab2Camel(component.name.replace(/^u-/, ''));
    });

    return components.filter((component) => !!component.path);
};

exports.groupComponents = function (components) {
    const groupsMap = {};
    components.forEach((component) => {
        component.group = component.group || '';
        if (!groupsMap[component.group])
            groupsMap[component.group] = { name: component.group, children: [] };
        groupsMap[component.group].children.push(component);
    });
    return Object.keys(groupsMap).map((key) => groupsMap[key]);
};

