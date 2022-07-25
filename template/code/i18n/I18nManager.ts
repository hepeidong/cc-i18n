import { Asset, JsonAsset, resources, Sprite, SpriteFrame } from "cc";
import { II18nComponent } from "./interface/II18nComponent";
import { ILanguageJson } from "./interface/ILanguageJson";
import { ISpriteAssets } from "./interface/ISpriteAssets";
import { Language } from "./LanguageEnum";

const I18N_TEXT_URL = 'i18n/text/';
const I18N_SPRITE_URL = 'i18n/sprite/';

export class I18nManager {
    private static _ins: I18nManager = null;

    private _language: string;
    private _textData: ILanguageJson;
    private _cacheSpriteFrame: ISpriteAssets;
    private _cacheTextAssetMap: Map<string, ILanguageJson>;
    private _labelList: II18nComponent[];
    private _spriteList: II18nComponent[];
    constructor() {
        this._language      = null;
        this._textData     = {};
        this._cacheSpriteFrame   = {};
        this._cacheTextAssetMap = new Map();
        this._labelList          = [];
        this._spriteList         = [];
    }

    public static getInstance() {
        if (this._ins === null) {
            this._ins = new I18nManager();
        }

        return this._ins;
    }

    public init(callback: Function) {
        return new Promise((resolve) => {
            let p = this.setLanguage(Language.zh);
            p.then(() => {
                callback();
                resolve(true);
            }).catch(e => console.log(e));
        });
    }

    public setLanguage(language: Language) {
        return new Promise((resolve) => {
            let lanKey: string = Language[language];
            if (this._language === lanKey) {
                return;
            }
    
            this._language = lanKey;
            this.log('初始化语言类型', lanKey);
            this.resetSpriteData();
            let p1 = this.resetTextData();
            let arrPromise = [];
            arrPromise.push(p1);
            Promise.all(arrPromise).then(()=>{
                resolve(true);
            }).catch((e: any)=>{
                console.error("加载语言资源异常", e);
                resolve(true);
            })
        });
    }

    public log(...args: any[]) {
        console.log('[i18n]', ...args);
    }

    public addLabel(label: II18nComponent) {
        let index: number = this._labelList.indexOf(label);
        if (index === -1) {
            this._labelList.push(label);
        }
    }

    public addSprite(sprite: II18nComponent) {
        let index: number = this._spriteList.indexOf(sprite);
        if (index === -1) {
            this._spriteList.push(sprite);
        }
    }

    public removeLabel(label: II18nComponent) {
        let index: number = this._labelList.indexOf(label);
        if (index !== -1) {
            this._labelList.splice(index, 1);
        }
    }

    public removeSprite(sprite: II18nComponent, key: string) {
        let index: number = this._spriteList.indexOf(sprite);
        if (index !== -1) {
            this._spriteList.splice(index, 1);
        }
        this.decRef(key);
    }

    /**
     * 获取语言文件中的文本
     * @param key 对应的语言文件中的键
     * @param params 当前文本需要插入的内容，插入位置是文本中的{0},{1}等等这类字符
     */
    public getText(key: string, params?: string[]) {
        this.checkInit();
        if (!params || params.length === 0) {
            return this._textData[key] || key;
        }
        let str = this._textData[key] || key;
        return this.replaceStr(str, params);
    }

    public setSprite(sprite: Sprite, key: string) {
        this.checkInit();
        this.loadI18nAssets(I18N_SPRITE_URL + `${this._language}/${key}/spriteFrame`, SpriteFrame, (asset: SpriteFrame) => {
            asset.texture.addRef();
            sprite.spriteFrame = asset;
            this.decRef(key);
            this._cacheSpriteFrame[key] = asset;
        });
    }

    private decRef(key: string) {
        if (key in this._cacheSpriteFrame) {
            this._cacheSpriteFrame[key].decRef();
        }
    }

    private replaceStr(str: string, params: any[]) {
        let result = str;
        for (let i: number = 0; i < params.length; ++i) {
            result = result.replace(`{${i}}`, params[i]);
        }
        return result;
    }

    private checkInit() {
        if (!this._language) {
            this.setLanguage(Language.zh);
        }
    }

    private resetTextData() {
        return new Promise((resolve) => {
            this.log('当前标签的语言类型', this._language);
            if (!this._cacheTextAssetMap.has(this._language)) {
                this.loadI18nAssets(I18N_TEXT_URL + this._language, JsonAsset, (asset: JsonAsset) => {
                    this._textData = asset.json as ILanguageJson;
                    this._cacheTextAssetMap.set(this._language, asset.json as ILanguageJson);
                    this.resetLabel();
                    resolve(true);
                });
            }
            else {
                this._textData = this.initLanguageData(this._cacheTextAssetMap, this._textData);
                this.resetLabel();
                resolve(true);
            }
        });
    }

    private resetLabel() {
        for (let label of this._labelList) {
            label.reset();
        }
    }

    private resetSpriteData() {
        this.log('当前纹理的语言类型', this._language);
        for (let sprite of this._spriteList) {
            sprite.reset();
        }
    }

    private loadI18nAssets<T extends Asset>(url: string, type: new() => T, callback: (asset: T) => void) {
        resources.load(url, type, (err: Error, asset: T) => {
            if (err) {
                console.error('i18n资源加载错误', err);
                return;
            }
            callback && callback(asset);
        });
    }

    private initLanguageData(cacheMap: Map<string, ILanguageJson>, data: ILanguageJson) {
        if (cacheMap.has(this._language)) {
            data = cacheMap.get(this._language);
        }
        else {
            data = {};
        }
        return data;
    }
}