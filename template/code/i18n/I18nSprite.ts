
import { _decorator, Component, Node, log, Sprite, isValid, CCString } from 'cc';
import { EDITOR } from 'cc/env';
import { I18nManager } from './I18nManager';
import { II18nComponent } from './interface/II18nComponent';
const { ccclass, property, executeInEditMode, requireComponent, disallowMultiple, menu } = _decorator;

/**
 * Predefined variables
 * Name = I18nSprite
 * DateTime = Thu Apr 14 2022 11:25:34 GMT+0800 (中国标准时间)
 * Author = taotao2017
 * FileBasename = I18nSprite.ts
 * FileBasenameNoExtension = I18nSprite
 * URL = db://assets/scripts/i18n/I18nSprite.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('I18nSprite')
@requireComponent(Sprite)
@disallowMultiple
@menu('i18n/I18nSprite')
export class I18nSprite extends Component implements II18nComponent {
    @property(CCString)
    private _string: string = '';

    @property(CCString)
    get string(): string { return this._string; }
    set string(val: string) {
        this._string  = val;
        let sprite    = this.getComponent(Sprite);
        if (isValid(sprite) && !EDITOR) {
            I18nManager.getInstance().setSprite(sprite, val as string);
        }
    }

    start () {
        I18nManager.getInstance().addSprite(this);
        this.reset();
    }

    /**
     * 设置精灵显示
     * @param key 语言json文件中的key
     */
    public setSprite(key: string) {
        this.string = key;
    }

    public reset() {
        this.string = this._string;
    }

    onDestroy() {
        I18nManager.getInstance().removeSprite(this);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
