
import { _decorator, Component, JsonAsset, Enum, log, Label } from 'cc';
import { EDITOR } from 'cc/env';
import { I18nManager } from './I18nManager';
import { Language } from './LanguageEnum';
const { ccclass, property, executeInEditMode, disallowMultiple, menu } = _decorator;

/**
 * Predefined variables
 * Name = I18nAsset
 * DateTime = Wed Apr 13 2022 17:38:35 GMT+0800 (中国标准时间)
 * Author = taotao2017
 * FileBasename = I18nAsset.ts
 * FileBasenameNoExtension = I18nAsset
 * URL = db://assets/scripts/i18n/I18nAsset.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('I18nAsset')
// @executeInEditMode
@disallowMultiple
@menu('i18n/I18nAsset')
export class I18nAsset extends Component {

    @property({
        type: Enum(Language),
        displayName: '语言选择'
    })
    private language: Language = Language.zh;

    @property(Label)
    private label: Label = null;

    // @property([JsonAsset])
    // private _labelAssets: JsonAsset[] = [];

    // @property(
    // {
    //     type: [JsonAsset],
    //     displayName: '标签语言'
    // })
    // get labelAssets(): JsonAsset[] { return this._labelAssets; }
    // set labelAssets(val: JsonAsset[]) {
    //     this._labelAssets = val;
    //     I18nManager.getInstance().initLabelAssetMap(val);
    // }

    // @property([JsonAsset])
    // private _textAssets: JsonAsset[] = [];

    // @property({
    //     type: [JsonAsset],
    //     displayName: '文本语言'
    // })
    // get textAssets(): JsonAsset[] { return this._textAssets; }
    // set textAssets(val: JsonAsset[]) {
    //     this._textAssets = val;
    //     I18nManager.getInstance().initTextAssetMap(val);
    // }

    onLoad() {
        I18nManager.getInstance().setLanguage(this.language);
    }

    start () {
        
    }

    onChinese() {
        I18nManager.getInstance().setLanguage(Language.zh);
        this.label.string = I18nManager.getInstance().getText('0', '测试');
    }

    onEnglish() {
        I18nManager.getInstance().setLanguage(Language.en);
        this.label.string = I18nManager.getInstance().getText('0', 'Test');
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
