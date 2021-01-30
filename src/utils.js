const { Keyboard, Key } = require('telegram-keyboard')
import { listUserSearch, saveUserSearch, removeUserSearch } from './firebase'
import { searchItems } from './amazonApi'

export function getSearches({ ctx, userId }) {
    listUserSearch(userId).then(res => {
        if (res.length > 0) {
            const keyboard = Keyboard.make([
                res,
                ['Annulla']
            ]).inline()
            ctx.reply('Clicca sulla parola chiave che desideri smettere di monitorare:', keyboard);
        } else {
            ctx.reply('Non hai ricerche attive');
        }
    })
}

export function trackSearch({ search, userId, ctx }) {
    const keyword = search.getKeyword();
    if (keyword !== '') {
        saveUserSearch(search.getKeyword(), userId)
        search.setKeyword('')
        return ctx.reply('Perfetto! Riceverai un aggiornamento quotidiano su questa ricerca! 💪🏻');
    } else {
        return ctx.reply('👻  Questa chiave di ricerca non è più disponibile.');
    }
}

export function removeSearch({ ctx, userId }) {
    removeUserSearch(ctx.callbackQuery.data, userId)
    return ctx.replyWithMarkdown(`👻  Ho eliminato la ricerca *${ctx.callbackQuery.data}*`);
}

export async function doSearch(ctx, search) {
    return new Promise(async function (resolve) {
        search.setKeyword(ctx.message.text)
        await ctx.replyWithMarkdown(`✅ Ecco i risultati della ricerca *${ctx.message.text}*`)
        const results = await searchItems({keywords: ctx.message.text})
        console.log(results)
        if (!results || results.length === 0) return resolve(true)
        const promises = results.map(item => {
            if (
                item['Offers'] !== undefined &&
                item['Offers']['Listings'] !== undefined
            ) {
                
                const prices = item['Offers']['Listings'].reduce((previousValue, currentValue) => {
                    previousValue = previousValue + `
💶 <b>${currentValue.Price.DisplayAmount}</b> ${currentValue.SavingBasis ? `<strike> ${currentValue.SavingBasis.DisplayAmount} </strike>` : ''} ${currentValue.Price.Savings ? `Sconto di ${currentValue.Price.Savings.DisplayAmount}` : ''}
                    `
                    return previousValue;
                }, '');
            

            return ctx.replyWithPhoto(
                { url: item['Images']['Primary']['Large']['URL'] },
                {
                caption: `<b>${item['ItemInfo']['Title']['DisplayValue']}</b>
${prices}
👉🏻 ${item['DetailPageURL']}`,
                parse_mode: 'HTML'
                }
            )
            }
        })

        const keyboard = Keyboard.make([
            ['Monitora Ricerca', 'Nuova Ricerca'],
        ]).inline()

        Promise.all(promises).then(() => {
            ctx.reply('✅ La ricerca è completata, cosa vuoi fare adesso?',keyboard) 
            resolve(true)})
        }
    )
}