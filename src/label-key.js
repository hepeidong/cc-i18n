const Fs = require('fs');
const { ParseI18nKey } = require('./ParseI18nKey');
const { utils } = require('./utils');

const parseI18nKey = new ParseI18nKey();



function getLabelKey(fileData, componentPlace) {
    const nodeEle = parseI18nKey.getNodeEle(fileData, componentPlace);
    if (nodeEle) {
        const keys = [nodeEle._name];
        let p = nodeEle._parent;
        while (p) {
            const temp = fileData[p.__id__];
            utils.insertElement(keys, temp._name, 0);
            p = temp._parent;
        }
        return keys.join('_');
    }
    return '';
}

function getLabelKey1(fileData, componentPlace) {
    const nodeEle = parseI18nKey.getNodeEle(fileData, componentPlace);
    if (nodeEle) {
        const keys = [];

        let p = nodeEle._parent;
        while (p) {
            const temp = fileData[p.__id__];
            p = temp._parent;
            if (!p) {
                keys.push(temp._name);
                keys.push(componentPlace);
            }
        }

        return keys.join('_');
    }
    return '';
}

function getLabelString(fileData, componentPlace, component) {
    const nodeEle = parseI18nKey.getNodeEle(fileData, componentPlace);
    if (nodeEle) {
        const components = nodeEle._components;
        for (const ele of components) {
            const id = ele.__id__;
            const prefabEle = fileData[id];
            if (prefabEle.__type__ === component) {
                return prefabEle._string;
            }
        }
    }
    return null;
}

function contain(obj, value) {
    for (const key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return '';
}

function juageSpaceChar(str) {
    for (let i = 0; i < str.length; ++i) {
        if (str[i] !== " ") {
            return false;
        }
    }
    if (str.length === 1 && str[0] !== '\n') {
        return false;
    }
    return true;
}

function juageI18nKey(key) {
    if (typeof key === 'string') {
        const flag = key in parseI18nKey.zhObj;
        if (!juageSpaceChar(key)) {
            return flag;
        }
    }
    return true;
}


/**
 * 给i18nLabel组件设置key值
 * @param {any[]} fileData 预制体文本数据
 * @param {Number} componentPlace 增加的组件在文本中的位置
 * @param {String} zhFilePath 放文字的json文件路径
 * @param {String} component 根据存在的这个组件增加I18nLabel脚本组件，在这里是cc.Label
 * @returns 
 */
function setKeyAndAddI18nLabel(fileData, componentPlace, zhFilePath, component) {
    const zhObj = parseI18nKey.getZhObj(zhFilePath);
    const prefabEle = parseI18nKey.getPrefabEle(fileData, componentPlace);
    if (prefabEle && juageI18nKey(prefabEle._string)) {
        const labelString = getLabelString(fileData, componentPlace, component);
        if (labelString !== 'label' && labelString.length > 0 && !juageSpaceChar(labelString)) {
            let key = contain(zhObj, labelString);
            if (key.length === 0) {
                key = getLabelKey1(fileData, componentPlace);
                zhObj[key] = labelString;
            }
            prefabEle._string = key;
        }
    }
}

function gennerateI18nKey(fileData, componentPlace, zhFilePath, component) {
    const zhObj = parseI18nKey.getZhObj(zhFilePath);
    const labelEle = fileData[componentPlace];
    if (labelEle.__type__ === component) {
        const labelString = labelEle._string;
        if (labelString !== 'label' && labelString.length > 0 && !juageSpaceChar(labelString)) {
            let key = contain(zhObj, labelString);
            if (key.length === 0) {
                key = getLabelKey1(fileData, componentPlace);
                zhObj[key] = labelString;
            }
        }
    }
}

function setKeyForI18nLabel(fileData, componentPlace, zhFilePath, component) {
    const zhObj = parseI18nKey.getZhObj(zhFilePath);
    const prefabEle = parseI18nKey.getPrefabEle(fileData, componentPlace);
    if (prefabEle && juageI18nKey(prefabEle._string)) {
        const labelString = getLabelString(fileData, componentPlace, component);
        if (labelString !== 'label' && labelString.length > 0 && !juageSpaceChar(labelString)) {
            let key = contain(zhObj, labelString);
            if (key.length > 0) {
                prefabEle._string = key;
            }
        }
    }
}

function saveZhFile(zhFilePath) {
    parseI18nKey.saveZhFile(zhFilePath);
}

module.exports = {
    setKeyAndAddI18nLabel(fileData, componentPlace, zhFilePath, component) {
        setKeyAndAddI18nLabel(fileData, componentPlace, zhFilePath, component);
    },

    gennerateI18nKey(fileData, componentPlace, zhFilePath, component) {
        gennerateI18nKey(fileData, componentPlace, zhFilePath, component);
    },

    setKeyForI18nLabel(fileData, componentPlace, zhFilePath, component) {
        setKeyForI18nLabel(fileData, componentPlace, zhFilePath, component);
    },

    saveZhFile(zhFilePath) {
        saveZhFile(zhFilePath);
    }
};