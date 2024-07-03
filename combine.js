import khandar from './block_khandar.js'
import sawaiMadhopur from './block_sawai_madhopur.js'
import chauthKaBarwada from './block_chauth_ka_barwada.js'
import others from './block_others.js'

let dict = {
    khandar: khandar,
    sawaiMadhopur: sawaiMadhopur,
    chauthKaBarwada: chauthKaBarwada,
    others: others,
}

let allData = []

let id = 1
for (let block of Object.values(dict)) {
    for (let row of block) {
        row.id = id
        id++
        allData.push(row)
    }
}

export default allData
