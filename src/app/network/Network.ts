import { Socket } from 'net';
import { App } from '../App';

export class Network
{
    public static async sendMessage(commande: string, ...data: string[]) 
    {
        return new Promise(function(resolve, reject) {

            if(!App.config.serverMus.enable) reject('MusSocket désactivé');
        
            const message = `${commande}${Network.chr(1)}${data.join(Network.chr(1))}`;

            const client = new Socket();
            client.connect(App.config.serverMus.port, App.config.serverMus.ip);

            client.on('connect', () => { 
                client.write(message);
                client.destroy();

                resolve(null); 
            });

            client.on('close', () => reject('La connexion a échoué'));
        });
    }

    private static chr(codePt: number) 
    {
        if (codePt <= 0xffff) return String.fromCharCode(codePt);

        codePt -= 0x10000;
        return String.fromCharCode(
            0xd800 + (codePt >> 10),
            0xdc00 + (codePt & 0x3ff)
        );
    }
}