import clc from 'cli-color';

export class Logger
{
    context: string;
    contextInstance: string;

    printLogger: boolean;
    static lastTimestamp: number = Date.now();

    constructor(context?: string, contextInstance?: string)
    {
        this.context = context || null;
        this.contextInstance = contextInstance || null;

        this.printLogger = true;
    }

    log(message: string): void
    {
        this.printMessage(message, clc.green);
    }

    error(message: string, trace?: string): void
    {
        this.printMessage(trace || message, clc.red);
    }

    warn(message: string): void
    {
        this.printMessage(message, clc.yellow);
    }

    printMessage(message: string, color?: clc.Format): void
    {
        if(this.printLogger)
        {
            const d = new Date();
            const timeNow =
        `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`.replace(
            /(^|\D)(\d)(?!\d)/g,
            '$10$2'
        );

            process.stdout.write(`[Logger] ${color(`${timeNow}`)} `);
            this.context && process.stdout.write(clc.cyan(`[${this.context}] `));
            this.contextInstance &&
        process.stdout.write(clc.blackBright(`[${this.contextInstance}] `));
            process.stdout.write(color(message));

            this.printTimestamp();
            process.stdout.write('\n');
        }
    }

    printTimestamp()
    {
        const now = Date.now();

        process.stdout.write(
            clc.blackBright(` +${now - Logger.lastTimestamp || 0}ms`)
        );

        Logger.lastTimestamp = now;
    }
}
