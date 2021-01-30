require('dotenv').config()
import "core-js/stable";
import "regenerator-runtime/runtime";
const { Telegraf } = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const Scene = require('telegraf/scenes/base')
const { leave } = Stage
const { Keyboard, Key } = require('telegram-keyboard') 
import "./cron";
import { listSearches } from "./cron";
import {testSearches} from "./cron"
import { authenticate } from './firebase'
import { getSearches, trackSearch, doSearch, removeSearch } from './utils'
import { Search } from "./searchClass";
const fastify = require('fastify')()

const PORT = process.env.PORT || 3000;
console.log(PORT)

const search = new Search()

const mainKeyboard = Keyboard.make([
    ['Avvia nuova ricerca', 'Lista delle ricerche'],
])

authenticate()

const greeter = new Scene('greeter')
greeter.enter((ctx) => ctx.reply(`💪🏻 Sono pronto. Dimmi il nome del prodotto che vuoi cercare.

/cancel`))
greeter.command('cancel',() => {
    console.log("leave")
    leave()
})
greeter.on('message', async (ctx) => doSearch(ctx, search).then(() =>  { console.log("leave"); ctx.scene.leave('greeter')} ))
// Create scene manager
const stage = new Stage()
stage.command('cancel', leave())

// Scene registration
stage.register(greeter)

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
    try {
        await ctx.reply('Usa i tasti funzione o digita / per visualizzare i comandi', mainKeyboard.reply())
    } catch (e) {
        console.log(e)
    }
})


bot.command('avvia', (ctx) => ctx.scene.enter('greeter') )
bot.command('lista', (ctx) => {
    const userId = ctx.update.message.chat.id
    getSearches({ctx, userId})
})
bot.hears('Avvia nuova ricerca', (ctx) => ctx.scene.enter('greeter'))
bot.hears('Lista delle ricerche', (ctx) => {
    const userId = ctx.update.message.chat.id
    getSearches({ctx, userId})
})

bot.on('callback_query', (ctx) => {
    const userId = ctx.callbackQuery.message.chat.id

    switch (ctx.callbackQuery.data) {
        case 'Monitora Ricerca':
            return trackSearch({search, userId, ctx})
        case 'Nuova Ricerca':
            return ctx.scene.enter('greeter')
        case 'Smetti di Monitorare':
            return getSearches({ctx, userId})
        case 'Continua a Monitorare':
            return ctx.reply('Perfetto! Riceverai un aggiornamento quotidiano su questa ricerca! 💪🏻');
        case 'Annulla':
            break;
        default:
            return removeSearch({ctx, userId});
    }
})

bot.launch()

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

/*fastify.get('/search', async (request, reply) => {
    return testSearches()
})

fastify.get('/list-search', async (request, reply) => {
    listSearches()
    return { hello: 'world' }
})*/
  
  
// Run the server!
const start = async () => {
    console.log("start")
    try {
        await fastify.listen(PORT, '0.0.0.0')
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()