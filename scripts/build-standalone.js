const fs = require('fs');
const path = require('path');

// 构建独立HTML文件
async function buildStandalone() {
    // 读取模板
    const templatePath = path.resolve(__dirname, '../public/template.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    // 读取构建后的文件
    const buildPath = path.resolve(__dirname, '../build');
    const cssContent = fs.readFileSync(path.resolve(buildPath, 'static/css/main.*.css'), 'utf8');
    const jsContent = fs.readFileSync(path.resolve(buildPath, 'static/js/main.*.js'), 'utf8');

    // 替换占位符
    let result = template
        .replace('/* STYLES_PLACEHOLDER */', cssContent)
        .replace('/* SCRIPT_PLACEHOLDER */', jsContent);

    // 写入独立HTML文件
    fs.writeFileSync(path.resolve(buildPath, 'standalone.html'), result);
}

buildStandalone().catch(console.error);