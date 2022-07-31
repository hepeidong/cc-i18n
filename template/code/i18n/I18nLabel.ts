
import { _decorator, Component, Label, isValid, CCString } from 'cc';
import { EDITOR } from 'cc/env';
import { I18nManager } from './I18nManager';
import { II18nComponent } from './interface/II18nComponent';
const { ccclass, property, requireComponent, disallowMultiple, menu } = _decorator;

/**
 * Predefined variables
 * Name = I18nLabel
 * DateTime = Wed Apr 13 2022 14:49:14 GMT+0800 (中国标准时间)
 * Author = taotao2017
 * FileBasename = I18nLabel.ts
 * FileBasenameNoExtension = I18nLabel
 * URL = db://assets/scripts/i18n/I18nLabel.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('I18nLabel')
@requireComponent(Label)
@disallowMultiple
@menu('i18n/I18nLabel')
export class I18nLabel extends Component implements II18nComponent {
    @property({
        tooltip: '是否是动态文本'
    })
    DTEXT: boolean = false;

    @property(CCString)
    private _string: string = '';

    @property(CCString)
    get string(): string { return this._string; }
    set string(val: string) {
        this._string = val;
        let label    = this.getComponent(Label);
        if (isValid(label) && !EDITOR) {
            label.string = I18nManager.getInstance().getText(this._string as string, ...this.params as string[]);
        }
    }

    @property([CCString])
    private params: string[] = [];

    start () {
        I18nManager.getInstance().addLabel(this);
        this.reset();
    }

    /**
     * 设置标签显示的内容
     * @param key 语言json文件中的key
     * @param params 替换{}字符串的参数
     */
    public setLabel(key: string, ...params: any[]) {
        this.params = params;
        this.string = key;
    }

    public reset() {
        this.string = this._string;
    }

    onDestroy() {
        I18nManager.getInstance().removeLabel(this);
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
