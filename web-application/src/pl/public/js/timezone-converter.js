document.addEventListener("DOMContentLoaded", function (event) {
    let offset = new Date().getTimezoneOffset()

    //Tue Feb 25 2020 13:21:58 GMT+0000 (Coordinated Universal Time)
    //Group 1 - (Tue Feb 25 2020 13:21:58 GMT)
    //Group 2 - (Feb)
    //Group 3 - (25)
    //Group 4 - (2020 13:21:58)
    const dateRegex = /(?:(?:\w{3,4}) (?:(?:(\w{3,4}) (\d{1,2}))([\s\S]+)))(?: GMT)/

    const datetimes = document.getElementsByClassName("datetime")
    for (datetime of datetimes) {
        const regexResult = datetime.textContent.match(dateRegex)
        let newDate = regexResult[2] + " " + regexResult[1] + " " + regexResult[3]
        let date = new Date(newDate + ' UTC').toLocaleDateString()
        let time = new Date(newDate + ' UTC').toLocaleTimeString()
        datetime.textContent = date + " " + time
    }
})
