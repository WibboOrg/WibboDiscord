import { App } from './app/App';
import readline from 'readline';

async function start()
{
    const app = new App();

    await app.bootstrap();
    await app.start();
}

start();

const in_ = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

setTimeout(prompt, 100);

function prompt()
{
    in_.question('>', async function (str: string)
    {
        await parseCommands(str);

        return prompt();
    });
}

async function parseCommands(str: string)
{
    switch(str)
    {
        case 'reboot':
            await App.INSTANCE.reboot();
            break;
        case 'clear':
            process.stdout.write('\\033c');
            break;
        case 'exit':
            await App.INSTANCE.dispose();
            process.exit();
            break;
    }
}

process.on('SIGINT', async () =>
{
    await App.INSTANCE.dispose();

    process.exit(0);
});

process.on('uncaughtException', (err: Error) =>
{
    const errorMsg = (err ? err.stack || err : '')
        .toString()
        .replace(new RegExp(`${__dirname}`, 'g'), './');

    console.log(errorMsg);
});
