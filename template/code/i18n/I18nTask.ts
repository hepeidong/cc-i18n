import { Asset } from "cc";
import { II18nComponent } from "./interface/II18nComponent";

export class I18nTask {
    private _components: II18nComponent[];
    protected _bundleUrl: string;
    protected _language: string;
    protected _lanBundle: Record<string, string>;
    constructor(language: string, bundleUrl: string) {
        this._language = language;
        this._bundleUrl = bundleUrl;
        this._components = [];
    }

    public load(): Promise<boolean> {
        return null;
    }

    public input(list: II18nComponent[]) {
        this._components = list;
    }

    public out() {
        const components = this._components;
        for (const target of components) {
            target.reset();
        }
    }

    public remove(target: II18nComponent) {
        const index = this._components.indexOf(target);
        if (index > -1) {
            this._components.splice(index, 1);
        }
    }

    protected error(...args: any[]) {
        console.error('[i18n]', ...args);
    }

    protected initLanBundle(): Promise<[void]> {
        return null;
    }

    protected loadI18nAssets<T extends Asset>(url: string, type: new() => T): Promise<T|T[]> {
        return null;
    }
}