import clc from 'cli-color';

export class Logger {
    _context: string;
    _contextInstance: string;

    _printLogger: boolean;
    static _lastTimestamp: number = Date.now();

    constructor(context?: string, contextInstance?: string) {
        this._context = context || null;
        this._contextInstance = contextInstance || null;

        this._printLogger = true;
    }

    log(message: any): void {
        this.printMessage(message, clc.green);
    }

    error(message: any, trace?: any): void {
        this.printMessage(trace || message, clc.red);
    }

    warn(message: any): void {
        this.printMessage(message, clc.yellow);
    }

    printMessage(message: any, color?: clc.Format): void {
        if (this._printLogger) {
            const d = new Date();
            const timeNow = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`.replace(/(^|\D)(\d)(?!\d)/g, '$10$2');;

            process.stdout.write(`[Logger] ${color(`${timeNow}`)} `);
            this._context && process.stdout.write(clc.cyan(`[${this._context}] `));
            this._contextInstance && process.stdout.write(clc.blackBright(`[${this._contextInstance}] `));
            process.stdout.write(color(message));

            this.printTimestamp();
            process.stdout.write(`\n`);
        }
    }

    printTimestamp() {
        const now = Date.now();

        process.stdout.write(clc.blackBright(` +${now - Logger._lastTimestamp || 0}ms`));

        Logger._lastTimestamp = now;
    }

    set contextInstance(value: any) {
        this._contextInstance = value;
    }

    set printLogger(value: boolean) {
        this._printLogger = value;
    }
}