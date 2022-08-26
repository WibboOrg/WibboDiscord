import { App } from './app/App';
import { setGlobalDispatcher, Agent } from 'undici';

setGlobalDispatcher(new Agent({ connect: { timeout: 60_000 } }));

(async () =>
{
    const app = new App();

    await app.bootstrap();
    await app.start();
})();