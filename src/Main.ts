import { App } from './app/App';

(async () =>
{
    const app = new App();

    await app.bootstrap();
    await app.start();
})();