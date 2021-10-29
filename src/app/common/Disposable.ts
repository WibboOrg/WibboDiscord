export abstract class Disposable
{
    protected isLoaded: boolean;
    protected isLoading: boolean;

    protected isDisposed: boolean;
    protected isDisposing: boolean;

    constructor()
    {
        this.isLoaded = false;
        this.isLoading = false;

        this.isDisposed = false;
        this.isDisposing = false;
    }

    async init(): Promise<void>
    {
        if(this.isLoaded || this.isLoading || this.isDisposing) return;

        this.isLoading = true;

        await this.onInit();

        this.isLoaded = true;
        this.isLoading = false;
        this.isDisposed = false;
    }

    async dispose(): Promise<void>
    {
        if(this.isDisposed || this.isDisposing || this.isLoading) return;

        this.isDisposing = true;

        await this.onDispose();

        this.isDisposed = true;
        this.isDisposing = false;
        this.isLoaded = false;
    }

  protected abstract onInit(): Promise<void>;

  protected abstract onDispose(): Promise<void>;
}
