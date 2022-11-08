export abstract class Log
{
    protected seconds: number;
    protected lastId: number;
    protected runInterval?: NodeJS.Timer;

    isRunning: boolean;

    constructor(seconds: number)
    {
        this.seconds = seconds;
        this.lastId = -1;
        this.runInterval = undefined;
        this.isRunning = false;
    }

    async run(): Promise<void>
    {
        if(!this.isRunning)
        {
            this.isRunning = true;

            await this.onRun();

            this.isRunning = false;
        }
    }

    async init(): Promise<void>
    {
        await this.onInit();
    }

    protected async onInit(): Promise<void>
    {
        //onInit
    }

    protected async onRun(): Promise<void>
    {
        //onRun
    }

    protected getTime(timestamp: number)
    {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return `${hours}:${minutes}:${seconds}`;
    }
}
