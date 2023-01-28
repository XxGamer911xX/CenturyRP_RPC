

const userconfig = require('../userconfig.json');
const DiscordRPC = require('discord-rpc');
const RPC = new DiscordRPC.Client({ transport: 'ipc' });
const NodeRSA = require('node-rsa');

const key = new NodeRSA();
const privatePem = 'MIIBOgIBAAJBAL2pgfbT09optIg4WLoU9F0LtM7NQwIJog31+++jcmOa5DEA08CLACcY2J4hXmNnpGA25zpjeHk3v0GlOjKi88UCAwEAAQJBAKyCc53oineTG4wThFCtIp9HOIwpk1tVG7uLFD6h8je5Z+0lt6W3e6C7u6HeQ/N1Vq39FznwVbiZsEhFVzE/qrkCIQDjanv/V72RH+SrX2+pBVgE6oes4w0/Miv4JWGLJmewLwIhANWAOggpWXc0P4V93i8V7HeDr5D1XLOQ5e4dLSyEB4pLAiAaJ1flUMDjXMiekNY1mQC7aAF8d4xBdVKrMhlauGr6TwIgCRh1YHOihBmNuzophQgCEvVhPWO2l0/M+9/yVLsrNxECIB2z6oJHHmBtR9lWvrVPPdta+8h5fhKgsHGgL1tuIWVa';
key.importKey(privatePem, 'pkcs1-pem');

const encryptedM = 'ROyPKZtj2dc8k/4sCc0Rp2VFhvTiRM9VZqqngzsBLwzBf+H5xT3cO26VrOg/tdDh3STk6wlhul+dVIe8VnMtcamrZUFUzI5doqv65WCcjdKPzyxzAavvLRqsWG/JqX+uXeYtnFgDUINpvlxPyIyndlo8hO7k8m6ATVwnxADbBQkKf377THtle5Jyz26OYRYrUE+z2VOHifKJfUrJSGWcT2IeuE8Rz5UyvX/ad7fKl6/UIUOwLt7pHD9CzySeF+tuGzd1/zgGH9gidVmP7nCAStfA+nTDsj1tKpap54saybexUcBM3CC4qK8jYQ9CGDQPcjLmSP1t1LMP4UrM5q83YQ==';
const decryptedStringM = key.decrypt(encryptedM, 'utf8');
const encryptedD = 'NzhoX/zNOaP8fnu6kwiNHv/MW6/9HhqKeK8vTNQXHfybUKqlxmFKDf3W4k24N9xjXoLMbPSIVa/G62vXe0z5zA==';
const decryptedStringD = key.decrypt(encryptedD, 'utf8');

const mongoose = require('mongoose');
const db = require("./databaseSchema");
mongoose.set('strictQuery', true);

const centurymta = require('gamedig');
const clientId = decryptedStringD;

DiscordRPC.register(clientId);

async function setActivity() {
    // Century RP IP { IF CHANGED FROM MONGO DB}
    var CenturyIP = await db.find({ server: "century" }, {_id:0,server:0,port:0,client:0})
    CenturyIP = CenturyIP.toString().replace("{ ip: '", "")
    CenturyIP = CenturyIP.toString().replace("' }", "")
    // Century RP IP { IF CHANGED FROM MONGO DB}

    // Century RP Port { IF CHANGED FROM MONGO DB}
    var CenturyPort = await db.find({ server: "century" }, {_id:0,server:0,ip:0,client:0 })
    CenturyPort = CenturyPort.toString().replace("{ port: '", "")
    CenturyPort = CenturyPort.toString().replace("' }", "")
    // Century RP Port { IF CHANGED FROM MONGO DB}

    // Server IP in a full line
    const partIp = ':'
    const partIp2 = CenturyIP.concat(partIp);
    const FullIP = partIp2.concat(CenturyPort)
    // Server IP in a full line

    if (!RPC) return;
    centurymta.query({
        type: 'mtasa',
        host: CenturyIP,
        port: CenturyPort
    }).then((state) => {
        const playerCounter = `${state.raw.numplayers}/${state.maxplayers}`;
        RPC.setActivity({
            details: `Name : ${userconfig.characterName}`,
            state: `[In-Game] Total Players : ${playerCounter}`,
            largeImageKey: `discord_century`,
            largeImageText: `CenturyRP • [ MTA Server ]`,
            smallImageKey: `discord_verify`,
            smallImageText: `Verified Server`,
            instance: false,
            buttons: [
                {
                    label: `Century Discord Server`,
                    url: `https://discord.gg/UNXGS4Qa2Y`,
                },
                {
                    label: `Century MTA:SA Server`,
                    url: `mtasa://${FullIP}`,
                }
            ]

        });
    }).catch((err) => {
        RPC.setActivity({
            details: `Name : ${userconfig.characterName}`,
            state: `${userconfig.status}`,
            largeImageKey: `discord_century`,
            largeImageText: `CenturyRP • [ MTA Server ]`,
            smallImageKey: `discord_verify`,
            smallImageText: `Verified Server`,
            instance: false,
            buttons: [
                {
                    label: `Century Discord Server`,
                    url: `https://discord.gg/UNXGS4Qa2Y`,
                },
                {
                    label: `Century MTA:SA Server`,
                    url: `mtasa://${FullIP}`,
                }
            ]
        });
    });
};
RPC.on('ready', async => {
                mongoose.connect(decryptedStringM).then((m) => {
                console.log("MongoDB connected successfully");
            }).catch((err) => {
                console.log("MongoDB Error , Contact Gamer");
            })
            console.log("Client Application connected successfully");
    setActivity();

    setInterval(() => {
        setActivity();
    }, 5000);
});

RPC.login({ clientId }).catch(err => console.error(err));