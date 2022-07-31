import { Sprite } from "cc";
import { I18nLabelTask } from "./I18nLabelTask";
import { I18nSpriteTask } from "./I18nSpriteTask";
import { I18nTask } from "./I18nTask";
import { II18nComponent } from "./interface/II18nComponent";
import { Language } from "./LanguageEnum";

const I18N_TEXT_URL = 'i18n/text/';
const I18N_SPRITE_URL = 'i18n/sprite/json/';

export class I18nManager {
    private static _ins: I18nManager = null;

    private _language: string;
    private _labelList: II18nComponent[];
    private _spriteList: II18nComponent[];
    private _textTasks: Map<string, I18nTask>;
    private _spriteTasks: Map<string, I18nTask>;
    constructor() {
        this._language      = null;
        this._labelList = [];
        this._spriteList = [];
        this._textTasks = new Map();
        this._spriteTasks = new Map();
    }

    public static getInstance() {
        if (this._ins === null) {
            this._ins = new I18nManager();
        }

        return this._ins;
    }

    public init() {
        return new Promise((resolve) => {
            let p = this.setLanguage(Language.zh);
            p.then(() => {
                resolve(true);
            }).catch(e => console.log(e));
        });
    }

    public setLanguage(language: Language) {
        return new Promise((resolve, reject) => {
            let lanKey: string = Language[language];
            if (this._language === lanKey) {
                return;
            }
    
            this._language = lanKey;
            this.log('初始化语言类型', lanKey);

            /////////////////////
            const promiseArr = [];
            if (!this._textTasks.has(lanKey)) {
                const task = new I18nLabelTask(lanKey, I18N_TEXT_URL);
                task.input(this._labelList);
                promiseArr.push(task.load());
                this._textTasks.set(lanKey, task);
            }
            if (!this._spriteTasks.has(lanKey)) {
                const task = new I18nSpriteTask(lanKey, I18N_SPRITE_URL);
                task.input(this._spriteList);
                promiseArr.push(task.load());
                this._spriteTasks.set(lanKey, task);
            }
            if (promiseArr.length > 0) {
                Promise.all(promiseArr).then(()=>{
                    this._textTasks.get(this._language).out();
                    this._spriteTasks.get(this._language).out();
                    resolve(true);
                }).catch((e)=>{
                    reject(e);
                })
            }
            else {
                this._textTasks.get(this._language).out();
                this._spriteTasks.get(this._language).out();
            }
        });
    }

    private log(...args: any[]) {
        console.log('[i18n]', ...args);
    }

    public addLabel(label: II18nComponent) {
        this._labelList.push(label);
    }

    public addSprite(sprite: II18nComponent) {
        this._spriteList.push(sprite);
    }

    public removeLabel(label: II18nComponent) {
        if (this._textTasks.has(this._language)) {
            this._textTasks.get(this._language).remove(label);
        }
    }

    public removeSprite(sprite: II18nComponent) {
        if (this._spriteTasks.has(this._language)) {
            this._spriteTasks.get(this._language).remove(sprite);
        }
    }

    /**
     * 获取语言文件中的文本
     * @param key 对应的语言文件中的键
     * @param params 当前文本需要插入的内容，插入位置是文本中的{0},{1}等等这类字符
     */
    public getText(key: string, ...params: any[]) {
        this.checkInit();
        if (this._textTasks.has(this._language)) {
            const task = this._textTasks.get(this._language) as I18nLabelTask;
            return task.getText(key, ...params);
        }
    }

    public setSprite(sprite: Sprite, key: string) {
        this.checkInit();
        if (this._spriteTasks.has(this._language)) {
            const task = this._spriteTasks.get(this._language) as I18nSpriteTask;
            task.setSprite(sprite, key);
        }
    }

    private checkInit() {
        if (!this._language) {
            this.setLanguage(Language.zh);
        }
    }
}