const got = require('got')
const log = console.log


var getWeekNumber = (d) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

var isDateWednesday = (date) => date.getDay() == 3

var isKerbfoodDay = (date) => getWeekNumber(date)[1] % 2 == 0 && isDateWednesday(date)

var aDate = new Date(2019, 2, 20)

var result = getWeekNumber(aDate);
log('It\'s currently week ' + result[1] + ' of ' + result[0]);

log(isKerbfoodDay(aDate))

// var isDateToday = (date) => currentDate().getTime() === date.getTime()
// var isDateTomorrow = (date) => getTomorrow().getTime() === date.getTime()

// var currentDate = () => {
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     return today
// }

// var getTomorrow = () => {
//     var today = new Date();
//     var tomorrow = new Date();
//     tomorrow.setDate(today.getDate() + 1);
//     tomorrow.setHours(0, 0, 0, 0)
//     return tomorrow
// }

// var parseDate = (str) => {
//     const date = new Date(str)
//     date.setHours(0, 0, 0, 0)
//     return date
// }

// const client = got.extend({
//     baseUrl: "http://api.streetdots.co.uk/consumer/whoson?spaceKey=7fb9be0f-1763-4129-a6d9-20fc4c7510a0&weekChange=0",
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });

// client.get('')
//     .then(response => {
//         const items = JSON.parse(response.body).filter(f => f.isLabel == false)

//         if (items.size == 0) {
//             res.send("empty")
//         } else {
//             const out = items.reduce((acc, item) => acc + `${item.traderName} (${item.byline})\n`, "")
//             log(out)
//         }
//     })


// const candidate = parseDate("2019-01-09T10:00:00")

// if (isDateTomorrow(candidate)) {
//     log('its today')
// } else {
//     log('NOT TODAY')
// }