import makeWASocket, { DisconnectReason, useMultiFileAuthState,  } from '@adiwajshing/baileys'
import { Boom } from '@hapi/boom'
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import moment from 'moment-timezone';
async function connectToWhatsApp () {
    const {state, saveCreds} = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        // can provide additional config here
        printQRInTerminal: true,
        auth: state
    })
    sock.ev.on('creds.update', saveCreds )
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];

        if (!msg.key.fromMe && m.type === 'notify' ){
            if (msg.message?.locationMessage){
                 const latitude = msg.message?.locationMessage?.degreesLatitude
                 const longutide = msg.message?.locationMessage?.degreesLongitude
                 
                 const coordinates = new Coordinates(latitude!, longutide!);
                 const params = CalculationMethod.MoonsightingCommittee();
                 const date = new Date() ;
                 const prayerTimes = new PrayerTimes(coordinates, date, params);
                 console.log(prayerTimes);
                 await sock.sendMessage(msg.key.remoteJid!, { text: processData(prayerTimes)})
            } else if (msg.message?.conversation === '/kristen'){
                await sock.sendMessage(msg.key.remoteJid!, { text: "don' forget to read al-kitab"})
            } else {
                await sock.sendMessage(msg.key.remoteJid!, { text: "This is bot for rermind the time of worship"})
            }
 
            
         } 

      
        
    })
}

function processData(data: any){
    return `time for shalat, today \n\n subuh : ${processTime(data.fajr)}\n Duha : ${processTime(data.sunrise)}\n Dzuhur : ${processTime(data.dhuhr)}\n ashar : ${processTime(data.asr)}\n maghrib : ${processTime(data.maghrib)}\n isha : ${processTime(data.isha)} `
}

function processTime(time: any){
    return moment(time)
            .tz('Asia/Jakarta')
            .format('HH:mm') + " WIB"
}
connectToWhatsApp()