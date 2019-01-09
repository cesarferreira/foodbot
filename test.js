const got = require('got')
const log = console.log


var isDateToday = (date) => currentDate().getTime() === date.getTime()
var isDateTomorrow = (date) => getTomorrow().getTime() === date.getTime()

var currentDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
}

var getTomorrow = () => {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
}

var parseDate = (str) => {
    const date = new Date(str)
    date.setHours(0, 0, 0, 0)
    return date
}

const client = got.extend({
    baseUrl: "http://api.streetdots.co.uk/consumer/whoson?spaceKey=7fb9be0f-1763-4129-a6d9-20fc4c7510a0&weekChange=0",
    headers: {
        'Content-Type': 'application/json'
    }
});

client.get('')
    .then(response => {
        // const items = JSON.parse(response.body)
        //     .filter(f => f.isLabel == false)

        // items
        //     .filter(f => isDateToday(parseDate(f.startDate)))
        //     .forEach(item => {
        //         log(`${item.traderName} (${item.byline}) @ ${item.startDate}`) // 
        //     })
        const items = JSON.parse(response.body).filter(f => f.isLabel == false)

        // res.send(parseDate("2019-01-11T00:00:00"))

        if (items.size == 0) {
            res.send("empty")
        } else {
            items
            // .map(f => res.send(parseDate(f.startDate)))
            // .filter(f => isDateToday(parseDate(f.startDate)))
                .forEach(item => {
                // log(`${item.traderName} (${item.byline}) @ ${item.startDate}`)
                log(`${item.traderName} (${item.byline})`) // @ ${item.startDate}
            })
        }
    })


// const candidate = parseDate("2019-01-09T10:00:00")

// if (isDateTomorrow(candidate)) {
//     log('its today')
// } else {
//     log('NOT TODAY')
// }