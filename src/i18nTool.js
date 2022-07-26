var Fs = require('fs');
const { getDirname } = require('../get -dirname');
require('colors');
const { setKeyForI18nLabel, saveZhFile, gennerateI18nKey, setKeyForI18n } = require('./label-key');
const { utils } = require('./utils');


//项目动态资源目录
var _file_prefab_path = "";
//需要增加的组件的meta问题路径
var _file_script_path = "";
//生成的i18n语言映射key存储json文件
var _file_zh_json_path = "";
const _file_temp_path = utils.rawUrl(getDirname(), 'file-temp.txt');
//处理的文件类型后缀
const _file_type = 'prefab';
/**
 * 如果是删除组件，则会删除这里设定的类型组件
 * 如果是增加组件，会以这个组件条件，当节点存在这个组件，则增加相应的脚本组件
 */
 var _component = "";


function getUuid() {
    return utils.uuid(_file_script_path);
}

function changeNodeId(nodeData, changeEleIndex) {
    const node = nodeData.node;
    if (node) {
        const id = node.__id__;
        if (id >= changeEleIndex) {
            nodeData.node.__id__ = id - 2;
        }
    }
}

function changePrefabId(nodeData, changeEleIndex, key) {
    const prefab = nodeData[key];
    if (prefab) {
        const id = prefab.__id__;
        if (id >= changeEleIndex) {
            nodeData[key].__id__ = id - 2;
        }
    }
}

function changeComponentId(nodeData, changeEleIndex) {
    const components = nodeData._components;
    if (components) {
        for (const ele of components) {
            const id = ele.__id__;
            if (id >= changeEleIndex) {
                ele.__id__ = id - 2;
            }
        }
    }
}

function changeChildrenId(nodeData, changeEleIndex) {
    const children = nodeData._children;
    if (children) {
        for (const ele of children) {
            const id = ele.__id__;
            if (id >= changeEleIndex) {
                ele.__id__ = id - 2;
            }
        }
    }
}

function changeParentId(nodeData, changeEleIndex) {
    const parent = nodeData._parent
    if (parent) {
        const id = parent.__id__
        if (id >= changeEleIndex) {
            nodeData._parent.__id__ = id - 2;
        }
    }
}
//改变脚本挂载的属性在文本中的Id数据
function changeScriptPropId(obj, changeEleIndex) {
    const id = obj.__id__;
    if (typeof id === 'number') {
        if (id >= changeEleIndex) {
            obj.__id__ = id - 2;
        }
    }
}

function changeRoot(root, changeEleIndex) {
    if (root.__id__ >= changeEleIndex) {
        root.__id__ = root.__id__ - 2;
    }
}

function changeInstance(instance, changeEleIndex) {
    if (instance.__id__ >= changeEleIndex) {
        instance.__id__ = instance.__id__ - 2;
    }
}

function changePropertyOverrides(fileData, propertyOverrides, changeEleIndex) {
    for (const info of propertyOverrides) {
        if (info.__id__ >= changeEleIndex) {
            info.__id__ = info.__id__ - 2;
        }

        const propOverInfo = fileData[info.__id__];
        const targetInfo = propOverInfo.targetInfo;
        if (targetInfo.__id__ >= changeEleIndex) {
            targetInfo.__id__ = targetInfo.__id__ - 2;
        }
    }
}

function changePrefabInfo(fileData, nodeData, changeEleIndex) {
    const root = nodeData.root;
    const instance = nodeData.instance;
    changeRoot(root, changeEleIndex);
    changeInstance(instance, changeEleIndex);

    const prefabRootNode = fileData[instance.__id__].prefabRootNode;
    if (prefabRootNode.__id__ >= changeEleIndex) {
        prefabRootNode.__id__ = prefabRootNode.__id__ - 2;
    }
    const propertyOverrides = fileData[instance.__id__].propertyOverrides;
    changePropertyOverrides(fileData, propertyOverrides, changeEleIndex);
}

/**
 * 增加i18nLabel组件
 * @param {any[]} fileData 
 * @param {Number} place 
 * @param {Number} nodeId 
 * @returns 返回是否增加成功，如果当前节点已存在此组件，则不会重复增加，返回false
 */
function addComponentToPrefab(fileData, place, nodeId) {
    const uuid = getUuid();
    // utils.log('增加组件', uuid);
    const data = Fs.readFileSync(_file_temp_path).toString();
    const temp = JSON.parse(data);
    temp[0].__type__ = uuid;
    temp[0].node.__id__ = nodeId;
    temp[0].__prefab.__id__ = place + 1;
    temp[1].fileId = utils.getFileId();
    const node = fileData[nodeId];
   
    const components = node['_components'];
    if (components) {
        let exis = false;
        for (const ele of components) {
            const id = ele['__id__'];
            if (fileData[id]['__type__'] === uuid) {
                exis = true;
                break;
            }
        }
        if (!exis) {
            utils.insertElement(fileData, temp[1], place);
            utils.insertElement(fileData, temp[0], place);
            components.push({__id__: place});
            return true;
        }
        else {
            utils.log('节点 ' + node['_name'].warn + ' 已经有了' + uuid.warn + ' 组件');
        }
    }
    else {
        utils.insertElement(fileData, temp[1], place);
        utils.insertElement(fileData, temp[0], place);
        components = [{__id__: place}];
        return true;
    }
    return false;
}

/**
 * 是否有相应的组件
 * @param {any[]} fileData 
 * @param {any} element 
 * @param {String} component 组件名
 * @returns 
 */
 function hasComponent(fileData, element, component) {
    const components = element._components;
    if (components) {
        let index = -1;
        for (const ele of components) {
            index++;
            const id = ele.__id__;
            const data = fileData[id];
            
            if (data.__type__ === component) {
                return {flag: true, id, componentArrIndex: index};
            }
        }
    }
    return {flag: false, id: -1, componentArrIndex: -1};
}

function juageObjType(obj) {
    if (obj !== null) {
        if (typeof obj === 'object') {
            return true;
        }
    }
    return false;
}

function juageKey(key) {
    if (
        key !== 'node' && 
        key !== '__prefab' && 
        key !== '_components' && 
        key !== 'data' && 
        key !== '_children' && 
        key !== 'root' &&
        key !== 'asset' &&
        key !== 'propertyOverrides' &&
        key !== 'prefabRootNode' &&
        key !== 'instance' &&
        key !== 'targetInfo') {
            return true;
    }
    return false;
}

/**
 * 刷新预制体挂载的脚本绑定的属性的id信息
 * @param {any} node 
 * @param {Number} changeEleIndex 
 * @param {Boolean} addComponent 
 */
function refreshScriptProp(node, changeEleIndex) {
    for (const key in node) {
        if (juageKey(key)) {
            const obj = node[key];
            if (juageObjType(obj)) {
                if (Array.isArray(obj)) {
                    for (const ele of obj) {
                        if (juageObjType(ele)) {
                            changeScriptPropId(ele, changeEleIndex);
                        }
                    }
                }
                else {
                    changeScriptPropId(obj, changeEleIndex);
                }
            }
        }
    }
}

function refreshScript(node, changeEleIndex) {
    let tempIndex = node.__type__.indexOf('cc.');
    if (tempIndex === -1) {
        refreshScriptProp(node, changeEleIndex)   ;
    }
    else if (
        node.__type__ !== 'cc.CompPrefabInfo' &&
        node.__type__ !== 'cc.PrefabInfo' &&
        node.__type__ !== 'cc.PrefabInstance' &&
        node.__type__ !== 'CCPropertyOverrideInfo' &&
        node.__type__ !== 'cc.TargetInfo' &&
        node.__type__ !== 'cc.UITransform' &&
        node.__type__ !== 'cc.Label' &&
        node.__type__ !== 'cc.Sprite') {

            for (const key in node) {
                const obj = node[key];
                if (juageObjType(obj)) {
                    if (obj.__id__) {
                        refreshScriptProp(node, changeEleIndex);
                    }
                    return;
                }
            }
    }
}

function refreshRefPrefab(fileData, node, changeEleIndex) {
    const id = node._prefab.__id__;
    const prefabInfo = fileData[id];
    if (prefabInfo.root.__id__ > 1) {
        changePrefabInfo(fileData, prefabInfo, changeEleIndex)
    }
}

function refreshPrefab(fileData, changeEleIndex) {
    for (const node of fileData) {
        //刷新预制体各个节点组件在文本中的位置信息
        if (node['__type__'] === 'cc.Node') {
            changeComponentId(node, changeEleIndex);
            changePrefabId(node, changeEleIndex, '_prefab');
            changeChildrenId(node, changeEleIndex);
            changeParentId(node, changeEleIndex);
            
            //处理预制体上关联的其他预制体，即把其他预制体直接挂到当前预制体下，成为当前预制体的一个子节点这种情况
            refreshRefPrefab(fileData, node, changeEleIndex);
        }
        else if (node['__type__'] !== 'cc.Node') {
            changeNodeId(node, changeEleIndex);
            changePrefabId(node, changeEleIndex, '__prefab');

            //更新预制体挂载的脚本组件绑定的节点在文本中的位置信息
            refreshScript(node, changeEleIndex);
        }
    }
}


/**
 * 删除组件
 * @param {any[]} fileData 预制体数据，那个数组存储的数据
 * @param {String} component 所要删除的组件
 * @returns 返回删除了组件的预制体数据
 */
function removeComponent(fileData, component) {
    let flag = false;
    for (let index = 0; index < fileData.length; ++index) {
        const value = fileData[index];
        const result = hasComponent(fileData, value, component);
        
        let changeEleIndex = -1;
        if (result.flag) {
            flag = result.flag;
            //移除组件的操作
            changeEleIndex = result.id;
            fileData.splice(result.id, 2);
            utils.log('在 '.warn + index + ' 位置的节点'.warn + '删除 '.warn + component.black + ' 组件'.warn);
            const components = value['_components'];
            components.splice(result.componentArrIndex, 1);
            refreshPrefab(fileData, changeEleIndex);
        }
    }
    return {fileData, flag};
}

function addComponent(fileData, component) {
    let flag = false;
    const len = fileData.length;
    for (let index = 0; index < len; ++index)  {
        const value = fileData[index];
        const result = hasComponent(fileData, value, component);
        if (result.flag) {
            flag = result.flag;
            const success = addComponentToPrefab(fileData, fileData.length - 1, index);
            if (success) {
                utils.log('在 ' + index + ' 位置的节点 ' + value['_name'].success + ' 成功增加 ' + getUuid().success + ' 组件');
                fileData[1]._prefab.__id__ += 2;
            }
        }
    }
    return {fileData, flag};
}

function setLabelKey(fileData, component) {
    let flag = false;
    for (let i = 0; i < fileData.length; ++i) {
        if (fileData[i].__type__ === getUuid()) {
            flag = true;
            setKeyForI18nLabel(fileData, i, _file_zh_json_path, component);
        }
    }
    if (flag) {
        saveZhFile(_file_zh_json_path);
    }
    return fileData;
}

//处理完的预制体数据文件缓存
const _cache_prefab_file_list = [];
//处理完的预制体数据文件路径缓存
const _cache_prefab_path_list = [];
var slash = '/';
if (process.platform === 'win32') {
    slash = '\\';
}
/**
 * 遍历读取目录下的所有文件
 * @param {String} path 传入目录的路径
 * @param {String} component 要增加或者删除的组件
 * @param {Boolean} status 0:删除组件，1：增加组件，2：直接获取文件数据信息
 */
function readFileAllInDir(path, component, status) {
    var files = utils.getFiles(path);
    for (const file of files) {
        let filePath = path + slash + file;
        if (utils.isFile(filePath)) {
            if (utils.juageFileType(file, _file_type)) {
                //是文件，则读取里面的数据
                const fileData = Fs.readFileSync(filePath);
                //预制体文件解析后的数据，数据格式是数组形式存储
                let data = JSON.parse(fileData.toString());

                if (status < 2) {
                    let result;
                    if (status === 1) {
                        result = addComponent(data, component);
                    }
                    else if (status === 0) {
                        result = removeComponent(data, component);
                    }
                    if (result.flag) {
                        _cache_prefab_file_list.push(result.fileData);
                        _cache_prefab_path_list.push(filePath);
                    }
                }
                else if (status === 2) {
                    _cache_prefab_file_list.push(data);
                    _cache_prefab_path_list.push(filePath);
                }                
            }
        }
        else if (utils.isDir(filePath)) {
            //是目录，则继续递归遍历改目录
            readFileAllInDir(filePath, component, status);
        }
    }
}

function writeFile(component) {
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        Fs.writeFileSync(_cache_prefab_path_list[i], JSON.stringify(setLabelKey(_cache_prefab_file_list[i], component), null, 4));
        utils.log('写入文件 =>', _cache_prefab_path_list[i].path);
    }
}

//给所有的预制体中有cc.Label组件的节点增加i18nLabel组件，同时生成映射的key
//此方法暂不执行，因为预制体嵌套的情况无法处理，引擎会自动识别为新节点，会导致问题
function i18nTool() {
    readFileAllInDir(_file_prefab_path, _component, 1);
    writeFile(_component);
}


//直接生成i18n的文字key
function genI18nKey() {
    readFileAllInDir(_file_prefab_path, _component, 2);
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        const fileData = _cache_prefab_file_list[i];
        let flag = false;
        for (let i = 0; i < fileData.length; ++i) {
            //这个是没有增加组件，直接生成key值
            if (fileData[i].__type__ === _component) {
                const nodeId = fileData[i].node.__id__;
                const components = fileData[nodeId]._components;
                for (const e of components) {
                    if (fileData[e.__id__].__type__ === getUuid()) {
                        flag = true;
                        gennerateI18nKey(fileData, i, _file_zh_json_path, _component);
                        break;
                    }
                }
            }
        }
        if (flag) {
            saveZhFile(_file_zh_json_path);
        }
    }
}

//把key放入到相应组件里
function setI18nKey() {
    readFileAllInDir(_file_prefab_path, _component, 2);
    for (let i = 0; i < _cache_prefab_file_list.length; ++i) {
        const fileData = _cache_prefab_file_list[i];
        let flag = false;
        for (let i = 0; i < fileData.length; ++i) {
            //这个是没有增加组件，直接生成key值
            if (fileData[i].__type__ === getUuid()) {
                flag = true;
                setKeyForI18n(fileData, i, _file_zh_json_path, _component);
            }
        }
        if (flag) {
            Fs.writeFileSync(_cache_prefab_path_list[i], JSON.stringify(fileData, null, 4));
            utils.log('写入文件 =>', _cache_prefab_path_list[i].path);
        }
    }
}

module.exports = {
    initPath(prefabPath, scriptPath, zhJsonPath, component) {
        _file_prefab_path  = prefabPath;
        _file_script_path  = scriptPath;
        _file_zh_json_path = zhJsonPath;
        _component = component;
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
