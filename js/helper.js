const dayInMillis = 1000 * 60 * 60 * 24;

export function addDays(date, number) {
    return new Date(date.getTime() + number*dayInMillis)
}

export function getDayIndex(date) {
    const falseIndex = date.getDay();
    return falseIndex == 0 ? 6 : falseIndex -1 ;
}