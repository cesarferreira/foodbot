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

var getData = (robot) => {
    return robot.http("http://api.streetdots.co.uk/consumer/whoson?spaceKey=7fb9be0f-1763-4129-a6d9-20fc4c7510a0&weekChange=0")
        .header('Content-Type', 'application/json')
        .get()
}

const printItem = (res, item) => res.send(`*${item.traderName}* (${item.byline})`)
const printItemWithDate = (res, item) => res.send(`${item.startDate.split('T')[0]} - *${item.traderName}* (${item.byline})`)

module.exports = (robot) => {

    // HELP
    robot.respond(/help/igm, (res) => {
        res.send("week - all the food trucks for the week")
        res.send("today - all the food trucks for today")
        res.send("tomorrow - all the food trucks for tomorrow")
    })

    // WEEK
    robot.respond(/week/igm, (res) => {
        getData(robot)((err, resp, body) => {
            const items = JSON.parse(body)
                .filter(f => f.isLabel == false)

            if (items.length == 0) {
                res.send("No items")
            } else {
                items.forEach(item => printItemWithDate(res, item))
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
                res.send("No items")
            } else {
                items.forEach(item => printItem(res, item))
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
                res.send("No items")
            } else {
                items.forEach(item => printItem(res, item))
            }
        })
    })
}