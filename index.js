const fs = require('fs');
const path = require('path');

const views = require('./lib/views');
const hljs = require('highlight.js');
const jsdocParser = require('./lib/jsdoc-parser');
const codeActivator = require('./lib/code-activator');
const Vue = require('vue');
const vueRenderer = require('vue-server-renderer').createRenderer();

// Avoid base file to override sub's
const caches = {};

module.exports = function (content) {
    this.cacheable();

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

    // @TODO: loader options for markdown-it
    const mdRenderer = require('markdown-it')({
        langPrefix: 'lang-',
        html: true,
        linkify: true,
        highlight(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    const result = hljs.highlight(lang, str).value;
                    return `<pre class="hljs ${this.langPrefix}${lang}"><code>${result}</code></pre>`;
                } catch (e) {}
            }

            const result = mdRenderer.utils.escapeHtml(str);
            return `<pre class="hljs"><code>${result}</code></pre>`;
        },
    });

    fs.readFile(markdownPath, 'utf8', (err, markdown) => {
        if (err)
            return callback(err);

        const result = codeActivator.activate(markdown);
        result.html = mdRenderer.render(result.markdown);
        const api = jsdocParser.parse(content);

        vueRenderer.renderToString(new Vue({
            template: `<article v-if="api.class" class="u-article">${views.api}</article>`,
            data: { api },
        }), (err, html) => {
            html = views.template.replace('<!--vue-ssr-outlet-->', `
                <article class="u-article">${result.html}</article>
                ${html}
                <script>${result.script}</script>
            `);

            this.emitFile(vueName + '.html', html);
            callback(null, content);
        });
    });
};
