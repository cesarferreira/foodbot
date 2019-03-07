const log = console.log


var isDateToday = (date) => currentDate().getTime() === date.getTime()
var isDateTomorrow = (date) => getTomorrow().getTime() === date.getTime()

var currentDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
}

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

var getData = (robot) => {
    return robot.http("http://api.streetdots.co.uk/consumer/whoson?spaceKey=7fb9be0f-1763-4129-a6d9-20fc4c7510a0&weekChange=0")
        .header('Content-Type', 'application/json')
        .get()
}

const getItemText = (item) => `*${item.traderName}* (${item.byline})\n`
const getItemTextWithDate = (item) => `${item.startDate.split('T')[0]} - *${item.traderName}* (${item.byline})\n`

module.exports = (robot) => {

    // HELP
    robot.respond(/help/igm, (res) => {
        res.send("*week* - all the food trucks for the week\n" +
            "*today* - all the food trucks for today\n" +
            "*tomorrow* - all the food trucks for tomorrow")
    })

    // WEEK
    robot.respond(/week/igm, (res) => {
        getData(robot)((err, resp, body) => {
            const items = JSON.parse(body)
                .filter(f => f.isLabel == false)

            if (items.length == 0) {
                res.send("No food trucks available")
            } else {
                res.send(items.reduce((acc, item) => acc + getItemTextWithDate(item), ""))
            }
        })
    })

    // TODAY
    robot.respond(/today/igm, (res) => {
        getData(robot)((err, resp, body) => {
            const items = JSON.parse(body)
                .filter(f => f.isLabel == false)
                .filter(f => isDateToday(parseDate(f.startDate)))

            if (items.length == 0) {
                if (isKerbfoodDay(currentDate())) {
                    res.send("kerb food day: https://www.kerbfood.com/markets/paddington/")
                } else {
                    res.send("No food trucks available")
                }
            } else {
                items.forEach(item => getItemText(item))
                res.send(items.reduce((acc, item) => acc + getItemText(item), ""))
            }
        })
    })

    // TODAY
    robot.respond(/suggestion/igm, (res) => {
        getData(robot)((err, resp, body) => {
            const items = JSON.parse(body)
                .filter(f => f.isLabel == false)
                .filter(f => isDateToday(parseDate(f.startDate)))

            if (items.length == 0) {
                res.send("No food trucks available")
            } else {
                var randomItem = items.sort(function() { return 0.5 - Math.random() })[0];
                res.send("Today's chef's suggestion: " + getItemText(randomItem))
            }
        })
    })

    // TOMORROW
    robot.respond(/tomorrow/igm, (res) => {
        getData(robot)((err, resp, body) => {
            const items = JSON.parse(body)
                .filter(f => f.isLabel == false)
                .filter(f => isDateTomorrow(parseDate(f.startDate)))

            if (items.length == 0) {
                if (isKerbfoodDay(getTomorrow())) {
                    res.send("kerb food day: https://www.kerbfood.com/markets/paddington/")
                } else {
                    res.send("No food trucks available")
                }
            } else {
                res.send(items.reduce((acc, item) => acc + getItemText(item), ""))
            }
        })
    })
}