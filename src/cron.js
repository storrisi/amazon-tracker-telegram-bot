import { getSearches, getListSearches } from './firebase';
var cron = require('node-cron');
const { Keyboard, Key } = require('telegram-keyboard')
const Telegram = require('telegraf/telegram')
const telegram = new Telegram(process.env.BOT_TOKEN)
 
export class Cron {
    
    constructor(ctx) {
        this.ctx = ctx
        this.user = ctx.callbackQuery.message.chat.id
    }

    initialize() {
        this.ctx.telegram.sendMessage(this.user, `Riceverai un messaggio ogni giorno alle 6 di mattina`)
        
    }
}

export function initializeCron() {

    console.log("initializeCron")

    cron.schedule('0 7 * * *', () => {
        getSearches(telegram)
    })
    cron.schedule('0 15 * * *', () => {
        listSearches()
    })
}

export function testSearches() {
    listSearches()
}

export function listSearches() {
    const keyboard = Keyboard.make([
        ['Continua a Monitorare', 'Smetti di Monitorare'],
    ]).inline()

    getListSearches().then(res => {
        res.forEach(item => {
            Object.keys(item).forEach(userId => {
                telegram.sendMessage(userId,`Al momento hai ${item[userId].length} ricerc${item[userId].length > 1 ? 'he' : 'a'} attiv${item[userId].length > 1 ? 'e' : 'a'}, vuoi continuare a monitorarl${item[userId].length > 1 ? 'e' : 'a'}?`, keyboard)
            })
        })
    })

}

initializeCron()