import { Socket } from 'net';

export const sendMus = (commande: string, ...data: string[]) =>
{
    return new Promise(function (resolve, reject)
    {
        if(process.env.SERVER_MUS_ENABLE !== "true") reject('MusSocket désactivé');

        const message = `${commande}${chr(1)}${data.join(chr(1))}`;

        const socket = new Socket();
        socket.connect(parseInt(process.env.SERVER_MUS_PORT!), process.env.SERVER_MUS_HOST!);

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