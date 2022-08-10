var Fs = require('fs');
const { getDirname } = require('../get -dirname');
const { compressUuid } = require('./uuid');
require('colors');
const { join } = require('path');

const hex = [ // 0-255
    "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f",
    "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f",
    "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f",
    "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f",
    "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f",
    "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f",
    "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f",
    "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f",
    "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f",
    "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f",
    "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af",
    "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf",
    "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf",
    "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df",
    "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef",
    "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"
];

function generateUUID() {
    const d0 = Math.random() * 0xffffffff | 0
    const d1 = Math.random() * 0xffffffff | 0
    const d2 = Math.random() * 0xffffffff | 0
    const d3 = Math.random() * 0xffffffff | 0
    return hex[d0 & 0xff] + hex[d0 >> 8 & 0xff] + hex[d0 >> 16 & 0xff] + hex[d0 >> 24 & 0xff] + '-' +
      hex[d1 & 0xff] + hex[d1 >> 8 & 0xff] + '-' + hex[d1 >> 16 & 0x0f | 0x40] + hex[d1 >> 24 & 0xff] + '-' +
      hex[d2 & 0x3f | 0x80] + hex[d2 >> 8 & 0xff] + '-' + hex[d2 >> 16 & 0xff] + hex[d2 >> 24 & 0xff] +
      hex[d3 & 0xff] + hex[d3 >> 8 & 0xff] + hex[d3 >> 16 & 0xff] + hex[d3 >> 24 & 0xff];
}

//脚本的uuid
var _label_script_uuid = "";
var _sprite_script_uuid = "";
var _path_config = null;
var _i18nLabel_path = "";
var _i18nSprite_path = "";
var _i18nconfig = {
    i18nLabel: "",
    i18nSprite: ""
};
const  _i18nConfigFilename = "i18n.config.json";

module.exports.utils = {
    getFiles(path) {
        return Fs.readdirSync(path);
    },
    
    isFile(path) {
        let stat = Fs.statSync(path);
        return stat.isFile();
    },
    
    isDir(path) {
        let stat = Fs.statSync(path);
        return stat.isDirectory();
    },

    /**
     * 文件是否为预制体文件
     * @param {String} filename 文件名
     * @param {String} type 文件类型后缀
     * @returns 返回是否为指定文件判断结果
     */
    juageFileType(filename, type) {
        let suffix = filename.split('.').pop();
        if (suffix.trim() === type.trim()) {
            return true;
        }
        return false;
    },

    /**
     * 在数组中插入元素
     * @param {any[]} array 
     * @param {any} ele 
     * @param {Number} place 
     */
    insertElement(array, ele, place) {
        if (array.length < place) {
            return;
        }
        for (let i = array.length - 1; i >= place; --i) {
            array[i + 1] = array[i];
            if (i === place) {
                array[i] = ele;
                return;
            }
        }
    },

    generateUUID() {
        return generateUUID();
    },

    getPathConfig() {
        if (!_path_config) {
            const configStr = Fs.readFileSync(this.nodeCwd('config.json')).toString();
            const config = JSON.parse(configStr);
            const platform = process.platform;
            if (platform === 'darwin') {
                this.log('运行环境', '"' + 'MacOS'.cyan + '"');
                _path_config = config.mac;
            }
            else if (platform === 'win32') {
                this.log('运行环境', '"'+ 'Windows'.cyan + '"');
                _path_config = config.win;
            }
            else {
                throw new Error('工具只能在windows平台或者mac平台下运行');
            }
        }
        return _path_config;
    },

    cwd(path) {
        var url = '';
        url = join(process.cwd(), path);
        return url;
    },

    rawUrl(path, filename) {
        return join(path, filename);
    },

    nodeCwd(path) {
        return join(getDirname(), path);
    },

    templateUrl() {
        return this.cwd('i18n_template');
    },

    setI18nLabelPath(path) {
        _i18nLabel_path = path;
    },

    writeI18nconfig(labelScriptPath, spriteScriptPath) {
        let config;
        if (Fs.existsSync(this.cwd(_i18nConfigFilename))) {
            config = this.readI18nconfig();
            config.i18nLabel = labelScriptPath;
            config.i18nSprite = spriteScriptPath;
        }
        else {
            _i18nconfig.i18nLabel = labelScriptPath;
            _i18nconfig.i18nSprite = spriteScriptPath;
            config = _i18nconfig;
        }
        Fs.writeFileSync(this.cwd(_i18nConfigFilename), JSON.stringify(config, null, 4));
    },

    readI18nconfig() {
        if (_i18nconfig.i18nLabel.length === 0) {
            const configStr = Fs.readFileSync(this.cwd(_i18nConfigFilename)).toString();
            _i18nconfig = JSON.parse(configStr);
        }
        return _i18nconfig;
    },

    getI18nLabelPath() {
        if (_i18nLabel_path.length === 0) {
            this.readI18nconfig();
            _i18nLabel_path = _i18nconfig.i18nLabel;
        }
        return _i18nLabel_path;
    },

    getI18nSpritePath() {
        if (_i18nSprite_path.length === 0) {
            this.readI18nconfig();
            _i18nSprite_path = _i18nconfig.i18nSprite;
        }
        return _i18nSprite_path;
    },

    log(...args) {
        console.log('[' + 'i18nTool'.cyan + ']', ...args);
    },

    i18nLabelUuid(filePath) {
        if (_label_script_uuid.length === 0) {
            const fileData = Fs.readFileSync(filePath);
            const data     = JSON.parse(fileData.toString());
            _label_script_uuid   = compressUuid(data.uuid, false);
        }
        return _label_script_uuid;
    },

    i18nSpriteUuid(filePath) {
        if (_sprite_script_uuid.length === 0) {
            const fileData = Fs.readFileSync(filePath);
            const data     = JSON.parse(fileData.toString());
            _sprite_script_uuid   = compressUuid(data.uuid, false);
        }
        return _sprite_script_uuid;
    },

    getFileId() {
        return compressUuid(generateUUID(), false);
    }
}