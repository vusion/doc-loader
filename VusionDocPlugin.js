const views = require('./lib/views');
const Vue = require('vue');
const vueRenderer = require('vue-server-renderer').createRenderer();
const path = require('path');

let pkg;
try {
    pkg = require(path.resolve(process.cwd(), 'package.json'));
} catch(e) {
    pkg = {};
}

class VusionDocPlugin {
    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            const list = Object.keys(compilation.assets)
                .filter((item) => item.endsWith('.html') && item !== 'index.html')
                .map((item) => item.replace(/\.html$/, ''))
                .sort((a, b) => a.localeCompare(b));

            vueRenderer.renderToString(new Vue({
                template: `<article class="u-article">
                    <h1>{{ title }}</h1>
                    <ul>
                        <li v-for="item in list"><a class="u-link" :href="item + '.html'">&lt;{{ item }}&gt;</a></li>
                    </ul>
                </article>`,
                data: { list, title: pkg.description },
            }), (err, html) => {
                html = views.contents.replace('<!--vue-ssr-outlet-->', html);

                compilation.assets['index.html'] = {
                    source() { return html; },
                    size() { return html.length; },
                };

                callback();
            });
        });
    }
}

module.exports = VusionDocPlugin;
