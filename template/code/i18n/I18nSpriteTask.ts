import { Asset, assetManager, JsonAsset, resources, Sprite, SpriteFrame } from "cc";
import { I18nTask } from "./I18nTask";

export class I18nSpriteTask extends I18nTask {

    public load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.initLanBundle().then(() => {
                resolve(true);
            }).catch(reject);
        });
    }

    public setSprite(sprite: Sprite, key: string) {
        const uuid = this._lanBundle[key];
        assetManager.loadAny({uuid}, SpriteFrame, (err, asset) => {
            if (err) {
                this.error('i18n资源加载错误', err);
                return;
            }
            if (sprite.spriteFrame instanceof SpriteFrame) {
                sprite.spriteFrame.decRef();
            }
            sprite.spriteFrame = null;
            asset.addRef();
            sprite.spriteFrame = asset;
        });
    }

    protected initLanBundle() {
        const p = this.loadI18nAssets(this._bundleUrl + this._language, JsonAsset).then((assets) => {
            this._lanBundle = assets.json as Record<string, string>;
            assets.addRef();
        }).catch((err) => {
            this.error('i18n资源加载错误', err);
        });
        return Promise.all([p]);
    }

    protected loadI18nAssets<T extends Asset>(url: string, type: new() => T): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            resources.load(url, type, (err: Error, asset: T) => {
                if (err) {
                    return reject(err);
                }
                resolve(asset);
            });
        });
    }
}