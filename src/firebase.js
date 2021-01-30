import { admin } from './firebaseConfig'
import { searchItems } from './amazonApi' 

export function authenticate() {
    admin
    .auth()
    .getUser(process.env.USER_ID)
    .then((userRecord) => {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log(`Successfully fetched user data`);
    })
    .catch((error) => {
        console.log('Error fetching user data:', error);
    });
}

export function saveUserSearch(keyword, userId) {
    const db = admin.database();
    const ref = db.ref(`searches/${keyword}/${userId}`);
    ref.set(1)

    const userRef = db.ref(`users/${userId}/${keyword}`);
    userRef.set(1)
    return Promise.resolve(true)
}

export function removeUserSearch(keyword, userId) {
    const db = admin.database();
    const ref = db.ref(`searches/${keyword}/${userId}`);
    ref.remove()

    const userRef = db.ref(`users/${userId}/${keyword}`);
    userRef.remove()
    return Promise.resolve(true)
}

export function getSearches(telegram) {
    console.log("getSearches")
    return new Promise(function (resolve) {
        const searchesRef = admin.database().ref("searches")

        searchesRef.once("value", async function(snapshot) {
            const values = snapshot.val()
            //console.log(values)
            //console.log(Object.keys(values))
            Object.keys(values).forEach(async function(key) {
                const results = await searchItems({keywords: key})
                console.log("keyword", key)
                const users = Object.keys(values[key])
                console.log(users)
                users.forEach(function(chatId) {
                    console.log("chatId", chatId)

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
                        
                
                        return telegram.sendPhoto(chatId,
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
                
                    Promise.all(promises).then(() => {})
                })
            });
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });

      resolve(true)
    })
}


export async function getListSearches() {
    return new Promise(function (resolve) {
        const usersRef = admin.database().ref("users")
        usersRef.once("value", function(snapshot) {
            const values = snapshot.val()

            if (!values) return resolve([])

            const users = Object.keys(values).map(function(key) {
                const keys = Object.keys(values[key])
                return {[key]: keys}
            })
            resolve(users)
        })
    });
}

export async function listUserSearch(userId) {
    return new Promise(function (resolve) {
        const usersRef = admin.database().ref(`users/${userId}`)
        usersRef.once("value", function(snapshot) {
            const values = snapshot.val()
            if (!values) return resolve([])
            const keys = Object.keys(values)
            resolve(keys)
        })
    });
}

export async function deleteSearch() {
    return new Promise(function (resolve) {
        resolve(true)
    })
}