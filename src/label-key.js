var Fs = require('fs');
const { utils } = require('./utils');

var _zhObj = null;


function getZhObj(zhFilePath) {
    if (!_zhObj) {
        if (Fs.existsSync(zhFilePath)) {
            zhFile = Fs.readFileSync(zhFilePath);
            _zhObj  = JSON.parse(zhFile.toString());
        }
        else {
            _zhObj = {};
        }
    }
    return _zhObj;
}

function getPrefabEle(fileData, componentPlace) {
    const prefabEle = fileData[componentPlace];
    if (!prefabEle) {
        console.error('传入的componentPlace是非法的');
        return null;
    }
    return prefabEle
}

function getNodeEle(fileData, componentPlace) {
    const prefabEle = getPrefabEle(fileData, componentPlace);
    if (prefabEle) {
        const id = prefabEle.node.__id__;
        const nodeEle = fileData[id];
        return nodeEle;
    }
    return null;
}

function getLabelKey(fileData, componentPlace) {
    const nodeEle = getNodeEle(fileData, componentPlace);
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
    const nodeEle = getNodeEle(fileData, componentPlace);
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
    const nodeEle = getNodeEle(fileData, componentPlace);
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
        const flag = key in _zhObj;
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
 * @param {String} component 根据存在的这个组件增加其他脚本组件，在这里是cc.Label
 * @returns 
 */
function setKeyForI18nLabel(fileData, componentPlace, zhFilePath, component) {
    const zhObj = getZhObj(zhFilePath);
    const prefabEle = getPrefabEle(fileData, componentPlace);
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
    const zhObj = getZhObj(zhFilePath);
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

function setKeyForI18n(fileData, componentPlace, zhFilePath, component) {
    const zhObj = getZhObj(zhFilePath);
    const prefabEle = getPrefabEle(fileData, componentPlace);
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
    const keys = Object.keys(_zhObj);
    let zhStr = JSON.stringify(_zhObj);
    let resultStr = '';
    const insertPlace = [];
    for (let i = 0; i < keys.length; ++i) {
        let index = zhStr.indexOf('"' + keys[i]);
        if (index > -1) {
            insertPlace.push(index);
        }
    }

    for (let k = 0; k < zhStr.length; ++k) {
        if (insertPlace.indexOf(k) === -1) {
            if (k === zhStr.length - 1) {
                resultStr += '\n}';
            }
            else {
                resultStr += zhStr[k];
            }
        }
        else {
            resultStr += '\n\t' + zhStr[k];
        }
    }

    Fs.writeFileSync(zhFilePath, resultStr);
}

module.exports = {
    setKeyForI18nLabel(fileData, componentPlace, zhFilePath, component) {
        setKeyForI18nLabel(fileData, componentPlace, zhFilePath, component);
    },

    gennerateI18nKey(fileData, componentPlace, zhFilePath, component) {
        gennerateI18nKey(fileData, componentPlace, zhFilePath, component);
    },

    setKeyForI18n(fileData, componentPlace, zhFilePath, component) {
        setKeyForI18n(fileData, componentPlace, zhFilePath, component);
    },

    saveZhFile(zhFilePath) {
        saveZhFile(zhFilePath);
    }
};