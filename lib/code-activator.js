const reg = /```(.+?)\r?\n([\s\S]+?)\r?\n```/g;

exports.activate = (markdown) => {
    const result = {};

    let index = 0;
    result.script = [];
    result.markdown = markdown.replace(reg, (m, $1, $2) => {
        const id = 'u-example-' + index;
        result.script.push(`new Vue().$mount('#${id}');`);

        index++;
        return `<div id="${id}" class="u-example">${$2}</div>\n\n` + m;
    });
    result.script = result.script.join('\n');

    return result;
};
