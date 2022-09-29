import { Socket } from 'net';
import { Config } from '../Config';

export const sendMus = (commande: string, ...data: string[]) =>
{
    return new Promise(function (resolve, reject)
    {
        if(!Config.serverMus.enable) reject('MusSocket désactivé');

        const message = `${commande}${chr(1)}${data.join(chr(1))}`;

        const socket = new Socket();
        socket.connect(Config.serverMus.port, Config.serverMus.ip);

        socket.on('connect', () =>
        {
            socket.write(message);
            socket.destroy();

            resolve(null);
        });

        socket.on('close', () => reject('La connexion a échoué'));
    });
};

const chr = (codePt: number) =>
{
    if(codePt <= 0xffff) return String.fromCharCode(codePt);

    codePt -= 0x10000;
    return String.fromCharCode(
        0xd800 + (codePt >> 10),
        0xdc00 + (codePt & 0x3ff)
    );
};