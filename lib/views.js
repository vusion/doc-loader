const fs = require('fs');
const path = require('path');

// 读取views目录下所有ejs文件
const views = fs.readdirSync(path.join(__dirname, '../views'));
views.forEach((view) => {
    if (view.endsWith('.html'))
        exports[path.basename(view, '.html')] = fs.readFileSync(path.join(__dirname, '../views/' + view), 'utf8');
});
