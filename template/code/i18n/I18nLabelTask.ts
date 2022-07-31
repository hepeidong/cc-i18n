import { Asset, JsonAsset, resources } from "cc";
import { I18nTask } from "./I18nTask";

export class I18nLabelTask extends I18nTask {

    public load(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!this._lanBundle) {
                this.initLanBundle().then(() => {
                    resolve(true);
                }).catch(reject)
            }
            else {
                resolve(true);
            }
        });
    }

    public getText(key: string, ...params: any[]) {
        if (!params || params.length === 0) {
            return this._lanBundle[key] || key;
        }
        const str = this._lanBundle[key] || key;
        return this.replaceStr(str, params);
    }

    private replaceStr(str: string, params: any[]) {
        let result = str;
        for (let i: number = 0, len = params.length; i < len; ++i) {
            const arg = params[i];
            const temp = this._lanBundle[arg] || arg;
            result = result.replace(`{${i}}`, temp);
        }
        return result;
    }


    protected initLanBundle() {
        const p = this.loadI18nAssets(this._bundleUrl + this._language, JsonAsset).then((assets) => {
            this._lanBundle = {};
            for (const asset of assets) {
                asset.addRef();
                const json = asset.json;
                for (const key in json) {
                    this._lanBundle[key] = asset.json[key];
                }
            }
        }).catch((err) => {
            this.error('i18n资源加载错误', err);
        });
        return Promise.all([p]);
    }

    protected loadI18nAssets<T extends Asset>(url: string, type: new() => T): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            resources.loadDir(url, type, (err: Error, asset: T[]) => {
                if (err) {
                    return reject(err);
                }
                resolve(asset);
            });
        });
    }
}