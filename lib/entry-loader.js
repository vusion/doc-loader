const loaderUtils = require('loader-utils');

module.exports = function (content) {
    const config = loaderUtils.getOptions(this);

    // 两种入口
    if (config.type === 'component' || config.type === 'block')
        content = content.replace(/\/\* DEFAULT_PROJECT start \*\/[\s\S]+\/\* DEFAULT_PROJECT end \*\/\n/g, '');
    else
        content = content.replace(/\/\* COMPONENT_PACKAGE start \*\/[\s\S]+\/\* COMPONENT_PACKAGE end \*\/\n/g, '');

    if (!config.DOCS_COMPONENTS_PATH)
        content = content.replace(/\/\* DOCS_COMPONENTS_PATH start \*\/[\s\S]+\/\* DOCS_COMPONENTS_PATH end \*\/\n\n/g, '');
    if (!config.DOCS_IMPORTS_PATH)
        content = content.replace(/\/\* DOCS_IMPORTS_PATH start \*\/[\s\S]+\/\* DOCS_IMPORTS_PATH end \*\/\n\n/g, '');

    return content;
};
