const Fs = require('fs');
const { ParseI18nKey } = require("./ParseI18nKey");
const { utils } = require("./utils");

const parseI18nKey = new ParseI18nKey();

const _file_type = 'meta';

function traverseDir(dirPath) {
    const files = utils.getFiles(dirPath);
    for (const file of files) {
        if (file !== 'json') {
            const path = utils.rawUrl(dirPath, file);
            if (utils.isDir(path)) {
                const obj = {};
                gennerateI18nKey(path, obj);
                //写入文件
                const url = utils.cwd('assets/resources/i18n/sprite/json/' + file + '.json');
                Fs.writeFileSync(url, JSON.stringify(obj, null, 4));
            }
        }
    }
}

function gennerateI18nKey(path, obj) {
    const files = utils.getFiles(path);
    for (const file of files) {
        const filePath = utils.rawUrl(path, file);
        if (utils.isFile(filePath)) {
            if (utils.juageFileType(file, _file_type)) {
                const str = Fs.readFileSync(filePath).toString();
                const data = JSON.parse(str);
                const subMetas = data.subMetas;
                for (const key in subMetas) {
                    if (subMetas[key].name === 'spriteFrame') {
                        obj[subMetas[key].displayName] = subMetas[key].uuid;
                    }
                }
            }
        }
        else if (utils.isDir(filePath)) {
            gennerateI18nKey(filePath);
        }
    }
}


function setKeyForI18nSprite(fileData, componentPlace, zhFilePath, component) {
    const zhObj = parseI18nKey.getZhObj(zhFilePath);
    const nodeObj = parseI18nKey.getNodeEle(fileData, componentPlace);
    const components = nodeObj._components;
    if (components) {
        for (const e of components) {
            const prefabObj = fileData[e.__id__];
            if (prefabObj.__type__ === component) {
                const spriteFrame = prefabObj._spriteFrame;
                const uuid = spriteFrame.__uuid__;
                if (typeof uuid === 'string') {
                    if (uuid !== 'null') {
                        const key = parseI18nKey.contain(zhObj, uuid);
                        utils.log('设置key =', key);
                        if (key.length > 0) {
                            const i18nSprite = parseI18nKey.getPrefabEle(fileData, componentPlace);
                            i18nSprite._string = key;
                        }
                    }
                }
            }
        }
    }
}

module.exports.genSpriteKey = traverseDir;
module.exports.setKeyForI18nSprite = setKeyForI18nSprite;