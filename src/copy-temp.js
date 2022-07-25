const Fs = require('fs');
require('colors');
const { utils } = require('./utils');

const configObj = utils.getPathConfig();

function copy(src, dest) {
    const files = utils.getFiles(src);
    for (const file of files) {
        const path = utils.rawUrl(dest, file);
        if (!Fs.existsSync(path)) {
            const srcPath = utils.rawUrl(src, file);
            if (utils.isDir(srcPath)) {
                Fs.mkdirSync(path);
                utils.log('创建目录 =>', path.path);
                copy(srcPath, path);
            }
            else if (utils.isFile(srcPath)) {
                Fs.copyFileSync(srcPath, path);
                utils.log('拷贝文件 =>', path.path);
            }
        }
    }
}

function copyCode() {
    const projPath = utils.getPath(configObj._i18n_src_dir);
    const src = utils.cwd(utils.rawUrl('template', 'code'));
    let dest = '';
    if (Fs.existsSync(projPath + 'script')) {
        dest = utils.rawUrl(projPath, 'script');
    }
    else if (Fs.existsSync(projPath + 'scripts')) {
        dest = utils.rawUrl(projPath, 'scripts');
    }
    else if (Fs.existsSync(projPath + 'Script')) {
        dest = utils.rawUrl(projPath, 'Script');
    }
    else if (Fs.existsSync(projPath + 'Scripts')) {
        dest = utils.rawUrl(projPath, 'Scripts');
    }
    else {
        utils.log('缺少script目录'.error);
        process.exit();
    }
    copy(src, dest);
}

function copyRes() {
    const projPath = utils.getPath(configObj._i18n_res_dir);
    const src = utils.cwd(utils.rawUrl('template', 'res'));
    if (Fs.existsSync(projPath)) {
        copy(src, projPath);
    }
    else {
        utils.log('缺少resources目录'.error);
        process.exit();
    }
}

module.exports.copyCode = copyCode;
module.exports.copyRes = copyRes;