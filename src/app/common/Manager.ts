import { Disposable } from './Disposable';
import { Logger } from './utilities/Logger';
export abstract class Manager extends Disposable {
    _logger: Logger;

    constructor(managerName: string, logger: Logger = null) {
        super();

        this._logger = new Logger(managerName);
    }

    async reload(): Promise<void> {
        await this.dispose();
        await this.init();
    }

    get logger(): Logger {
        return this._logger;
    }
}