const fs = require('fs');
const path = require('path');
const globby = require('globby');

const config = global.vusionConfig;
const libraryPath = path.resolve(process.cwd(), config.libraryPath);

const kebab2Camel = (name) => name.replace(/(?:^|-)([a-z])/g, (m, $1) => $1.toUpperCase());

const node = require("enhanced-resolve/lib/node");
const babelCore = require("babel-core");

// webpack同步文件解析 https://blog.johnnyreilly.com/2016/12/webpack-syncing-enhanced-resolve.html
function makeSyncResolver(options) {
    return node.create.sync(options.resolve);
}
const resolveSync = makeSyncResolver({});

// 生成routes，通过字符串拼接的形式
module.exports = function (content) {
    // 动态监听目录变化
    this.addContextDependency(libraryPath);

    const context = {}, resolveContext = {}, components = {}, importArr = {};

    /**
     * 解析后的路径转为md放入components
     * @param {*} name: vue组件名 
     * @param {*} p: index.js文件路径 
     * @param {*} inProject: 是否是本项目下组件
     * @param {*} layer: 路径查询层级, 第一个文件层级为0
     */
    const addToComponents = (name, p, inProject, layer) => {
        const mdPath = (path.dirname(p) + '/README.md').replace(/\\/g, '/');
        if (!fs.existsSync(mdPath))  return;
        // name = 'u' + camel2Kebab(name);
        components[name] = {
            name,
            path: mdPath,
            inProject: !layer ? inProject : false,
        };
    };

    /**
     * 递归得到变量的绝对引用路径
     * @param {*} lookupStartPath 当前查询目录
     * @param {*} subDir 子目录
     * @param {*} name 变量名
     * @param {*} isExternal 从外部包引入
     * @param {*} layer 层级
     */
    const getResolvedPath = (lookupStartPath, subDir, name, isExternal, layer) => {
        const resolvedFileName = resolveSync(undefined, path.dirname(lookupStartPath), subDir);
        if (isExternal) { // 外部引入，解析外部js
            transFormJs(resolvedFileName, layer + 1, name); // name为数组
        } else
            addToComponents(name, resolvedFileName, !isExternal, layer);
    }
    
    /**
     * 解析文件
     * @param {*} p 当前文件路径
     * @param {*} layer 层级
     * @param {*} name 在改文件中解析name中变量的路径，name不定义则处理所有变量。
     */
    const transFormJs = (p, layer, name) => {
        // TODO: 改为entry文件
        const data = fs.readFileSync(p.replace(/\\/g, '/'), {flag: 'r+', encoding: 'utf8'});
        
        // 读取出模块名和路径
        const res = babelCore.transform(data, {
            plugins: ["transform-export-extensions"]
        });
        res.metadata.modules.imports.forEach((item) => {
            item.specifiers && item.specifiers.forEach((s) => {
                importArr[s.local] = item.source;
            })
        });
        
        const externalObj = {};
        res.metadata.modules.exports.specifiers.forEach((s) => {
            if (name && !name.includes(s.exported)) // 不在初始文件的export中，不需要引入。
                return;
            if(s.kind === 'external') { // 外部引入
                if(externalObj[s.source])
                    externalObj[s.source].push(s.exported);
                else externalObj[s.source] = [s.exported];
                // getResolvedPath(p, s.source, s.exported, true, layer);
            } else {
                getResolvedPath(p, importArr[s.exported], s.exported, false, layer);
            }
        });
        Object.keys(externalObj).forEach((key) => {
            getResolvedPath(p, key, externalObj[key], true, layer);
        });
    };
    
    transFormJs(path.resolve(libraryPath, 'index.js'), 0);

    if (config.baseCSSPath) {
        let baseCSSPath = path.resolve(process.cwd(), config.baseCSSPath);
        baseCSSPath = baseCSSPath.replace(/\\/g, '/');
        content = `import '${baseCSSPath}';\n` + content;
    }

    return content.replace('/* Insert routes here */', Object.keys(components).map((name) => {
        const component = components[name];

        const meta = {
            name: component.name, // 驼峰格式
            inProject: component.inProject,
        };
        return `{ path: '${component.name}', component: () => import('${component.path}'), meta: ${JSON.stringify(meta)} }`;
    }).join(',\n'));
};
