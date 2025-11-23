export const formatTime = (time) => {
    const parsedTime = time.toString().split('.')

    let hours = parseInt(parsedTime?.[0] || 0, 10)
    let minutes = parseInt(parsedTime?.[1] || 0, 10)

    if (minutes >= 60) {
        minutes -= 60
        hours += 1
    }
    const formatedTime = `${hours}h ${minutes}m`

    return formatedTime
}

export const calculateElapsedTimeHours = (date) => {
    const startDate = new Date(date)
    const now = new Date();
    
    const result = +Math.abs((now - startDate) / (60 * 60 * 100) / 6).toFixed(2);

    return result
}


