export const formatTime = (time) => {
    const parsedTime = time.toString().split('.')

    const hours = parseInt(parsedTime?.[0] || 0, 10)
    const minutes = parseInt(parsedTime?.[1] || 0, 10)

    const formatedTime = `${hours}h ${minutes}m`

    return formatedTime
}

export const calculateElapsedTimeHours = (date) => {
    const startDate = new Date(date)
    const now = new Date();
    
    const result = +Math.abs((now - startDate) / (60 * 60 * 1000)).toFixed(2);

    return result
}