import { App } from './app/App';
import readline from 'readline';

async function start() {
    await App.bootstrap();

    await App.start();
}

start();

const in_ = readline.createInterface({ input: process.stdin, output: process.stdout });

setTimeout(prompt, 100);

function prompt() {
    in_.question(">", async function(str: string) {
        await parseCommands(str);

        return prompt();
    });
};

async function parseCommands(str: string) {
    switch (str) {
        case "reboot":
            await App.reboot();
            break;
        case "clear":
            process.stdout.write("\\033c");
            break;
        case "exit":
            await App.dispose();
            process.exit();
            break;
    }
}

process.on('SIGINT', async () => {
    await App.dispose();

    process.exit(0)
});

process.on('uncaughtException', (err: Error) => {
    const errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');

    console.log(errorMsg);
});