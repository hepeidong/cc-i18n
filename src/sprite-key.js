const { ParseI18nKey } = require("./ParseI18nKey");

const parseI18nKey = new ParseI18nKey();

function gennerateI18nKey(path) {
     
}

function setKeyForI18n(fileData, componentPlace, zhFilePath, component) {
    const zhObj = parseI18nKey.getZhObj(zhFilePath);
    const sprite = fileData[componentPlace];
    const spriteFrame = sprite._spriteFrame;
    if (typeof spriteFrame === 'string') {
        if (spriteFrame !== 'null') {
            const uuid = spriteFrame.__uuid__;

        }
    }
}