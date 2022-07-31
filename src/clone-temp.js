const download = require('download-git-repo');
const path = require('path');
const { getDirname } = require('../get -dirname');


function clone() {
    return new Promise((resolve, reject) => {
        download('github:hepeidong/i18n', path.join(getDirname(), '/template'), function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve('成功...');
        });
    });
}

module.exports.clone = clone;

