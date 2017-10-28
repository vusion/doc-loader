const fs = require('fs');
const path = require('path');

// Avoid base file to override sub's
const caches = {};

const vusionDocLoader = function (content) {
    // this.cacheable();

    const jsPath = this.resourcePath;
    const vuePath = path.dirname(this.resourcePath);
    const vueName = path.basename(vuePath, '.vue');
    const vueDir = path.dirname(vuePath);
    const markdownPath = path.join(vuePath, 'README.md');

    if (caches[vueName] && caches[vueName] !== vuePath)
        return content;
    else
        caches[vueName] = vuePath;

    this.addDependency(markdownPath);
    if (!fs.existsSync(markdownPath))
        return content;

    const callback = this.async();

    fs.readFile(markdownPath, 'utf8', (err, markdown) => {
        if (err)
            return callback(err);
        callback(null, content);
    });
};

vusionDocLoader.caches = caches;

module.exports = vusionDocLoader;
