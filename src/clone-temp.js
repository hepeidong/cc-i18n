const Fs = require('fs');
const download = require('download-git-repo');
const path = require('path');
const { utils } = require('./utils');


function clone() {
    return new Promise((resolve, reject) => {
        const url = utils.templateUrl();
        if (!Fs.existsSync(url)) {
            Fs.mkdirSync(url);
        }
        download('github:hepeidong/i18n', url, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve('成功...');
        });
    });
}

module.exports.clone = clone;

