var Fs = require('fs');
const { addComponent, removeComponent } = require('./change-prefab');
require('colors');
const { setKeyAndAddI18nLabel, saveZhFile, gennerateI18nKey, setKeyForI18nLabel } = require('./label-key');
const { genSpriteKey, setKeyForI18nSprite } = require('./sprite-key');
const { utils } = require('./utils');


//项目动态资源目录
var _file_prefab_path = "";
//需要I18nLabel组件的meta文件路径
var _label_meta_path = "";
//需要I18nSprite组件的meta文件路径
var _sprite_meta_path  = "";
//生成的Label的i18n语言映射key存储json文件的路径
var _label_zh_json_path = "";
//生成的Sprite的i18n语言映射key存储json文件的路径
var _sprite_zh_json_path = "";

//处理的文件类型后缀
const _file_type = 'prefab';
/**
 * 如果是删除组件，则会删除这里设定的类型组件
 * 如果是增加组件，会以这个组件条件，当节点存在这个组件，则增加相应的脚本组件
 */
 var _labelComponent = "";
 var _spriteComponent = "";


function getI18nLabelUuid() {
    return utils.i18nLabelUuid(_label_meta_path);
}

function getI18nSpriteUuid() {
    return utils.i18nSpriteUuid(_sprite_meta_path);
}


function setLabelKey(fileData, component) {
    let flag = false;
    for (let i = 0; i < fileData.length; ++i) {
        if (fileData[i].__type__ === getI18nLabelUuid()) {
            flag = true;
            setKeyAndAddI18nLabel(fileData, i, _label_zh_json_path, component);
        }
    }
    if (flag) {
        saveZhFile(_label_zh_json_path);
    }
    return fileData;
}

//处理完的预制体数据文件缓存
const _cache_prefab_file_list = [];
//处理完的预制体数据文件路径缓存
const _cache_prefab_path_list = [];

/**
 * 遍历读取目录下的所有文件
 * @param {String} path 传入目录的路径
 * @param {String} component 要增加或者删除的组件
 * @param {Boolean} status 0:删除组件，1：增加组件，2：直接获取文件数据信息
 */
function readFileAllInDir(path, callback) {
    const files = utils.getFiles(path);
    for (const file of files) {
        let filePath = utils.rawUrl(path, file);
        if (utils.isFile(filePath)) {
            if (utils.juageFileType(file, _file_type)) {
                //是文件，则读取里面的数据
                const fileData = Fs.readFileSync(filePath);
                //预制体文件解析后的数据，数据格式是数组形式存储
                let data = JSON.parse(fileData.toString());

                const result = callback && callback(data);
                if (result) {
                    _cache_prefab_file_list.push(result.fileData);
                }
                else {
                    _cache_prefab_file_list.push(data);
                }
                _cache_prefab_path_list.push(filePath);
            }
        }
        else if (utils.isDir(filePath)) {
            //是目录，则继续递归遍历改目录
            readFileAllInDir(filePath);
        }
    }
}

//删除cc.Label组件，暂时没用用，放在这里，用作技术储备
function removeLabel() {
    readFileAllInDir(_file_prefab_path, (data) => {
        return removeComponent(data, _labelComponent);
    });
}

function writeFile(component) {
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        Fs.writeFileSync(_cache_prefab_path_list[i], JSON.stringify(setLabelKey(_cache_prefab_file_list[i], component), null, 4));
        utils.log('写入文件 =>', _cache_prefab_path_list[i].path);
    }
}

//给所有的预制体中有cc.Label组件的节点增加i18nLabel组件
function i18nTool() {
    readFileAllInDir(_file_prefab_path, (data) => {
        return addComponent(data, _labelComponent, getI18nLabelUuid());
    });
    writeFile(_labelComponent);
}


//直接生成i18n的文字key
function genI18nKey() {
    readFileAllInDir(_file_prefab_path);
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        const fileData = _cache_prefab_file_list[i];
        let flag = false;
        for (let i = 0; i < fileData.length; ++i) {
            //这个是没有增加组件，直接生成key值
            if (fileData[i].__type__ === _labelComponent) {
                const nodeId = fileData[i].node.__id__;
                const components = fileData[nodeId]._components;
                for (const e of components) {
                    const i18nLabel = fileData[e.__id__];
                    if (i18nLabel.__type__ === getI18nLabelUuid()) {
                        //不是动态文本
                        if (!i18nLabel.DTEXT) {
                            flag = true;
                            gennerateI18nKey(fileData, i, _label_zh_json_path, _labelComponent);
                            break;
                        }
                    }
                }
            }
        }
        if (flag) {
            saveZhFile(_label_zh_json_path);
        }
    }

    genSpriteKey(utils.cwd('assets/resources/i18n/sprite'));
}

function setI18nLabelKey() {
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        const fileData = _cache_prefab_file_list[i];
        let flag = false;
        for (let i = 0; i < fileData.length; ++i) {
            //这个是没有增加组件，直接生成key值
            if (fileData[i].__type__ === getI18nLabelUuid()) {
                flag = true;
                setKeyForI18nLabel(fileData, i, _label_zh_json_path, _labelComponent);
            }
        }
        if (flag) {
            Fs.writeFileSync(_cache_prefab_path_list[i], JSON.stringify(fileData, null, 4));
            utils.log('设置I18nLabel写入文件  =>', _cache_prefab_path_list[i].path);
        }
    }
}

function setI18nSpriteKey() {
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        const fileData = _cache_prefab_file_list[i];
        let flag = false;
        for (let i = 0; i < fileData.length; ++i) {
            //这个是没有增加组件，直接生成key值
            if (fileData[i].__type__ === getI18nSpriteUuid()) {
                flag = true;
                setKeyForI18nSprite(fileData, i, _sprite_zh_json_path, _spriteComponent);
            }
        }
        if (flag) {
            Fs.writeFileSync(_cache_prefab_path_list[i], JSON.stringify(fileData, null, 4));
            utils.log('设置I18nSprite写入文件 =>', _cache_prefab_path_list[i].path);
        }
    }
}

//把key放入到相应组件里
function setI18nKey() {
    readFileAllInDir(_file_prefab_path);
    setI18nLabelKey();
    setI18nSpriteKey();
}

module.exports = {
    initPath(prefabPath, lanelMetaPath, labelZhJsonPath, spriteMetaPath, spriteZhJsonPath, component, spriteComponent) {
        _file_prefab_path  = prefabPath;
        _label_meta_path  = lanelMetaPath;
        _label_zh_json_path = labelZhJsonPath;
        _sprite_meta_path = spriteMetaPath;
        _sprite_zh_json_path = spriteZhJsonPath;
        _labelComponent = component;
        _spriteComponent = spriteComponent;
    },

    genI18nKey() {
        genI18nKey();
    },

    setI18nKey() {
        setI18nKey();
    },

    i18nTool() {
        i18nTool();
    }
}
