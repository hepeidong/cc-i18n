
const Fs = require('fs');

function ParseI18nKey() {

}

ParseI18nKey.prototype.zhObj = null;

ParseI18nKey.prototype.getZhObj = function(zhFilePath) {
    if (!this.zhObj) {
        if (Fs.existsSync(zhFilePath)) {
            zhFile = Fs.readFileSync(zhFilePath);
            this.zhObj  = JSON.parse(zhFile.toString());
        }
        else {
            this.zhObj = {};
        }
    }
    return this.zhObj;
}

ParseI18nKey.prototype.contain = function(obj, value) {
    for (const key in obj) {
        if (obj[key] === value) {
            return key;
        }
    }
    return '';
}

ParseI18nKey.prototype.getPrefabEle = function(fileData, componentPlace) {
    const prefabEle = fileData[componentPlace];
    if (!prefabEle) {
        console.error('传入的componentPlace是非法的');
        return null;
    }
    return prefabEle;
}

ParseI18nKey.prototype.getNodeEle = function(fileData, componentPlace) {
    const prefabEle = this.getPrefabEle(fileData, componentPlace);
    if (prefabEle) {
        const id = prefabEle.node.__id__;
        const nodeEle = fileData[id];
        return nodeEle;
    }
    return null;
}

ParseI18nKey.prototype.genI18nKey = function(fileData, componentPlace) {
    const nodeEle = this.getNodeEle(fileData, componentPlace);
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

ParseI18nKey.prototype.saveZhFile = function(zhFilePath) {
    const keys = Object.keys(this.zhObj);
    let zhStr = JSON.stringify(this.zhObj);
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

module.exports.ParseI18nKey = ParseI18nKey;