const fs = require('fs');
const path = require('path');

// Avoid base file to override sub's
const caches = {};

const vusionDocLoader = function (content) {
    this.cacheable();

    const vuePath = path.dirname(this.resourcePath);
    const vueName = path.basename(vuePath, '.vue');
    const markdownPath = path.join(vuePath, 'README.md');

    this.addDependency(markdownPath);
    if (!fs.existsSync(markdownPath))
        return content;

    if (!caches[vueName])
        caches[vueName] = markdownPath;

    return content;
};

vusionDocLoader.caches = caches;

module.exports = vusionDocLoader;
