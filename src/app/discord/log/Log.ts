import { Disposable } from "../../common/Disposable";

export abstract class Log extends Disposable {
    protected seconds: number;
    protected lastId: number;
    protected runInterval?: NodeJS.Timer;

    isRunning: boolean;

    constructor(seconds: number) {
        super();

        this.seconds = seconds;
        this.lastId = -1;
        this.runInterval = undefined;
        this.isRunning = false;
    }

    async run(): Promise<void> {
        if (!this.isRunning) {
            this.isRunning = true;

            await this.onRun();

            this.isRunning = false;
        }
    }

    protected async onRun(): Promise<void> {

    }

    protected getTime(unix_timestamp: number) {
        const date = new Date(unix_timestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();

        return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
    }
}