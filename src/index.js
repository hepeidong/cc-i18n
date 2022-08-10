const Fs = require('fs');
const { clone } = require('./clone-temp');
const { createI18nConfig, copyTemp } = require('./copy-temp');
require('colors');
const { genI18nKey, setI18nKey, i18nTool, initPath } = require('./i18nTool');
const { utils } = require('./utils');

const configObj = utils.getPathConfig();
//项目动态资源目录
const _file_prefab_path = configObj._file_prefab_path;
//生成的i18n语言映射key存储json文件
const _file_zh_json_path = configObj._file_zh_json_path;
const _file_zh_json_pic_path = configObj._file_zh_json_pic_path;



function path() {
    utils.log('正在初始化文件路径...');
    const path1 = utils.cwd(_file_prefab_path);
    const path2 = utils.getI18nLabelPath();
    const path3 = utils.cwd(_file_zh_json_path);
    const path4 = utils.getI18nSpritePath();
    const path5 = utils.cwd(_file_zh_json_pic_path);
    initPath(path1, path2, path3, path4, path5, 'cc.Label', 'cc.Sprite');
    utils.log('资源目录               =>', path1.path);
    utils.log('I18nLabel脚本meta文件  =>', path2.path);
    utils.log('label的json文件        =>', path3.path);
    utils.log('I18nSprite脚本meta文件 =>', path4.path);
    utils.log('sprite的json文件       =>', path5.path);
    utils.log('####################################################\n'.gray);
}

function genKey() {
    utils.log('正在生成i18n文字key...');
    genI18nKey();
    utils.log('####################################################\n'.gray);
    utils.log('成功...'.success);
}

function setKey() {
    utils.log('正在注入i18n文字key...');
    setI18nKey();
    utils.log('成功...'.success);
}

function run_gen_set_key() {
    path();
    genKey();
    setKey();
}

function run_gen_set_key_g() {
    path();
    utils.log('i18n工具运行...');
    i18nTool();
    utils.log('成功...'.success);
}

module.exports.path = path;
module.exports.genKey = genKey;
module.exports.setKey = setKey;
module.exports.run_gen_set_key = run_gen_set_key;
module.exports.run_gen_set_key_g = run_gen_set_key_g;
module.exports.copyTemp = copyTemp;
module.exports.createI18nConfig = createI18nConfig;
module.exports.clone = clone;