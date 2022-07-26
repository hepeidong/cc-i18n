#!/usr/bin/env node
const Fs = require('fs');
const colors = require('colors');
const minimist = require('minimist');
const { utils } = require('../src/utils');
const { genKey, path, setKey, run_gen_set_key_g, run_gen_set_key, copyCode, copyRes, createI18nConfig } = require('../src');
const { getDirname } = require('../get -dirname');

const commandStr = Fs.readFileSync(utils.rawUrl(getDirname(), 'command.json')).toString();
const command = JSON.parse(commandStr);

colors.setTheme({
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    path: () => {
        let color = '';
        const platform = process.platform;
        if (platform === 'darwin') {
            color = 'magenta';
        }
        else if (platform === 'win32') {
            color = 'white';
        }
        return color;
    },
    success: 'green'
});

const argv = minimist(process.argv.splice(2), {
    'g': false,
    'create': false,
    'gen-key': false,
    'set-key': false,
    'run-gen-set-key': false
});

const cmd = argv._[0];
if (cmd) {
    if (cmd === command.create) {
        utils.log('###########################################'.gray);
        utils.log('正在拷贝资源...'.warn);
        copyRes();
        copyCode();
        createI18nConfig();
        utils.log('成功...'.success);
        utils.log('###########################################'.gray);
    }
    else if (cmd === command.gen) {
        path();
        genKey();
        process.exit();
    }
    else if (cmd === command.set) {
        path();
        setKey();
        process.exit();
    }
    else if (cmd === command.run) {
        if (argv.g) {
            run_gen_set_key_g();
        }
        else {
            run_gen_set_key();
        }
        process.exit();
    }
    else {
        utils.log('无法搜索到命令: ' + cmd.error);
        process.exit();
    }
}
else {
    utils.log('无法搜索到命令: ' + cmd.error);
    process.exit();
}

