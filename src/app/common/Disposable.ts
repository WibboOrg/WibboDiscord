export abstract class Disposable {
    protected _isLoaded: boolean;
    protected _isLoading: boolean;

    protected _isDisposed: boolean;
    protected _isDisposing: boolean;

    constructor() {
        this._isLoaded = false;
        this._isLoading = false;

        this._isDisposed = false;
        this._isDisposing = false;
    }

    async init(): Promise<void> {
        if (this._isLoaded || this._isLoading || this._isDisposing) return;

        this._isLoading = true;

        await this.onInit();

        this._isLoaded = true;
        this._isLoading = false;
        this._isDisposed = false;
    }

    async dispose(): Promise<void> {
        if (this._isDisposed || this._isDisposing || this._isLoading) return;

        this._isDisposing = true;

        await this.onDispose();

        this._isDisposed = true;
        this._isDisposing = false;
        this._isLoaded = false;
    }

    protected abstract onInit(): Promise<void>;

    protected abstract onDispose(): Promise<void>;

    get isLoaded(): boolean {
        return this._isLoaded;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }

    get isDisposed(): boolean {
        return this._isDisposed;
    }

    get isDisposing(): boolean {
        return this._isDisposing;
    }
}