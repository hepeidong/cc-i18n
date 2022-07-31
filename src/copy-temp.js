const Fs = require('fs');
const { getDirname } = require('../get -dirname');
require('colors');
const { utils } = require('./utils');

const configObj = utils.getPathConfig();
var _file_label_script = "";
var _file_sprite_script = "";

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
                const filename = file.split('.')[0];
                if (filename === 'I18nLabel') {
                    _file_label_script = path;
                }
                else if (filename === 'I18nSprite') {
                    _file_sprite_script = path;
                }
            }
        }
    }
}

function copyCode() {
    const projPath = utils.getPath(configObj._i18n_src_dir);
    const src = utils.rawUrl(utils.rawUrl(getDirname(), 'template'), 'code');
    let dest = '';
    if (Fs.existsSync(utils.rawUrl(projPath,'script'))) {
        dest = utils.rawUrl(projPath, 'script');
    }
    else if (Fs.existsSync(utils.rawUrl(projPath, 'scripts'))) {
        dest = utils.rawUrl(projPath, 'scripts');
    }
    else if (Fs.existsSync(utils.rawUrl(projPath, 'Script'))) {
        dest = utils.rawUrl(projPath, 'Script');
    }
    else if (Fs.existsSync(utils.rawUrl(projPath, 'Scripts'))) {
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
    const src = utils.rawUrl(utils.rawUrl(getDirname(), 'template'), 'res');
    if (Fs.existsSync(projPath)) {
        copy(src, projPath);
    }
    else {
        utils.log('缺少resources目录'.error);
        process.exit();
    }
}

function createI18nConfig() {
    _file_label_script = _file_label_script + '.meta';
    _file_sprite_script = _file_sprite_script + '.meta';
    utils.writeI18nconfig(_file_label_script, _file_sprite_script);
}

module.exports.copyCode = copyCode;
module.exports.copyRes = copyRes;
module.exports.createI18nConfig = createI18nConfig;
