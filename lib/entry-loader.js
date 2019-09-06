const loaderUtils = require('loader-utils');

module.exports = function (content) {
    const config = loaderUtils.getOptions(this);

    if (!config.DOCS_COMPONENTS_PATH)
        content = content.replace(/\/\* DOCS_COMPONENTS_PATH start \*\/[\s\S]+\/\* DOCS_COMPONENTS_PATH end \*\/\n\n/g, '');
    if (!config.DOCS_IMPORTS_PATH)
        content = content.replace(/\/\* DOCS_IMPORTS_PATH start \*\/[\s\S]+\/\* DOCS_IMPORTS_PATH end \*\/\n\n/g, '');

    return content;
};
