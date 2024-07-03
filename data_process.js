const fs = require('fs')

let input = fs.readFileSync('data.json', 'utf-8')
let data = JSON.parse(input)

let processed = []
for (let i = 0; i < data.length; i++) {
    let row = data[i]
    let schoolName = row['School Name']
    let block = row['Block']
    let dist = row['Dist.']
    let nic = row['NIC Code']
    let match = schoolName.match(/.*SCHOOL,?\s+(?<location>.*)\s+(\\n)?\(\d+\)/)
    let location = match && match.groups && match.groups.location
    processed.push({
        schoolName,
        block,
        dist,
        nic,
        location,
        distance: '',
    })
}

let dataSubset = processed.filter((el) => {
    let block = el.block
    let arr = ['KHANDAR', 'SAWAI\nMADHOPUR', 'CHAUTH KA\nBARWARA']
    return !arr.includes(block)
})
console.log(dataSubset)
fs.writeFileSync('block_others.js', JSON.stringify(dataSubset))
