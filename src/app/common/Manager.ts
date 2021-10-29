import { Disposable } from './Disposable';
import { Logger } from './utilities/Logger';
export abstract class Manager extends Disposable
{
    logger: Logger;

    constructor(managerName: string, logger: Logger = null)
    {
        super();

        this.logger = new Logger(managerName);
    }

    async reload(): Promise<void>
    {
        await this.dispose();
        await this.init();
    }
}
