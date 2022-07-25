const Fs = require('fs');
const { copyCode, copyRes } = require('./copy-temp');
require('colors');
const { genI18nKey, setI18nKey, i18nTool, initPath } = require('./i18nTool');
const { utils } = require('./utils');

const configObj = utils.getPathConfig();
//项目动态资源目录
const _file_prefab_path = configObj._file_prefab_path;
//需要增加的组件的meta问题路径
const _file_script_path = configObj._file_script_path;
//生成的i18n语言映射key存储json文件
const _file_zh_json_path = configObj._file_zh_json_path;
/**
 * 如果是删除组件，则会删除这里设定的类型组件
 * 如果是增加组件，会以这个组件条件，当节点存在这个组件，则增加相应的脚本组件
 */
 const _component = configObj._component;


function path() {
    utils.log('正在初始化文件路径...');
    const path1 = utils.getPath(_file_prefab_path);
    const path2 = utils.getPath(_file_script_path);
    const path3 = utils.getPath(_file_zh_json_path);
    initPath(path1, path2, path3, _component);
    utils.log('资源目录 =>', path1.path);
    utils.log('meta文件 =>', path2.path);
    utils.log('json文件 =>', path3.path);
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
module.exports.copyCode = copyCode;
module.exports.copyRes = copyRes;