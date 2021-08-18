export abstract class Disposable
{
    protected _isLoaded: boolean;
    protected _isLoading: boolean;

    protected _isDisposed: boolean;
    protected _isDisposing: boolean;

    constructor()
    {
        this._isLoaded       = false;
        this._isLoading      = false;

        this._isDisposed     = false;
        this._isDisposing    = false;
    }

    public async init(): Promise<void>
    {
        if(this._isLoaded || this._isLoading || this._isDisposing) return;
        
        this._isLoading     = true;
        
        await this.onInit();

        this._isLoaded      = true;
        this._isLoading     = false;
        this._isDisposed    = false;
    }

    public async dispose(): Promise<void>
    {
        if(this._isDisposed || this._isDisposing || this._isLoading) return;
        
        this._isDisposing   = true;

        await this.onDispose();

        this._isDisposed    = true;
        this._isDisposing   = false;
        this._isLoaded      = false;
    }

    protected abstract onInit(): Promise<void>;

    protected abstract onDispose(): Promise<void>;
    
    public get isLoaded(): boolean
    {
        return this._isLoaded;
    }

    public get isLoading(): boolean
    {
        return this._isLoading;
    }

    public get isDisposed(): boolean
    {
        return this._isDisposed;
    }

    public get isDisposing(): boolean
    {
        return this._isDisposing;
    }
}