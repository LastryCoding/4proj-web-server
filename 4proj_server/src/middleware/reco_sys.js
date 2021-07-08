const TransactionSchema = require('./../models/transactions')

const MaxDuplicata = async (array) => {
    var maxNumber = 0;
    var theItem
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (element[1] > maxNumber) {
            maxNumber = element[1]
            theItem = element
        }
    }
    return theItem
}

const FindAny = async (nameArticle) => {
    var maxDupliItems = []
    await TransactionSchema
        .find({ "items.labels": nameArticle })
        .then(async (itemsDB) => {
            var listOfItems = []
            var listOfItemsDuplicated = []
            for (let i = 0; i < itemsDB.length; i++) {
                for (let j = 0; j < itemsDB[i].items.length; j++) {
                    const sndElement = itemsDB[i].items[j].labels;
                    if (sndElement != nameArticle) {
                        if (await listOfItems.includes(sndElement)) {
                            var bool = true
                            for (let z = 0; z < listOfItemsDuplicated.length; z++) {
                                const element = listOfItemsDuplicated[z];
                                if (element[0] == sndElement) {
                                    element[1] = parseInt(element[1]) + 1
                                    bool = false
                                }
                            }
                            if (bool) {
                                await listOfItemsDuplicated.push([sndElement, 1])
                            }
                        }
                        await listOfItems.push(sndElement)
                    }
                }
            }
            maxDupliItems = listOfItemsDuplicated
        }).catch(err => {
            console.log(err)
        })
    return maxDupliItems
}

const RecommendationSystem = async (panier) => {
    var itemRecommended = []
    var finalList = []
    for (let i = 0; i < panier.length; i++) {
        itemRecommended.push(await FindAny(panier[i]))
    }
    for (let i = 0; i < itemRecommended.length; i++) {
        for (let j = 0; j < itemRecommended[i].length; j++) {
            const element = itemRecommended[i][j];
            var bool = true
            for (let z = 0; z < panier.length; z++) {
                const NotRecommended = panier[z];
                if (element[0] == NotRecommended) {
                    bool = false
                }
            }
            if (bool) {
                finalList.push(element)
            }
        }
    }
    var Top3 = await getTop3(finalList)
    return Top3
}

const getTop3 = async (finalList) => {
    var Top3 = []
    var resultatFinal = await MaxDuplicata(finalList)
    Top3.push(resultatFinal)
    var tmpList = []
    for (let i = 0; i < finalList.length; i++) {
        const element = finalList[i];
        if (resultatFinal[0] !== element[0]) {
            tmpList.push(element)
        }
    }
    var resultatFinal2 = await MaxDuplicata(tmpList)
    Top3.push(resultatFinal2)
    tmpList = []
    for (let i = 0; i < finalList.length; i++) {
        const element = finalList[i];
        if (resultatFinal[0] !== element[0] && resultatFinal2[0] !== element[0]) {
            tmpList.push(element)
        }
    }
    var resultatFinal3 = await MaxDuplicata(tmpList)
    Top3.push(resultatFinal3)
    return Top3
}

module.exports = RecommendationSystem;