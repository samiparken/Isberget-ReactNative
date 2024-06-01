import moment from 'moment';

export const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';
const WEEKS = 'weeks';
const HOURS = 'hours';
const ISO_WEEK = 'isoWeek';

export const now = () => {
    return moment().format(DATE_FORMAT);
};

export const startOf = (date) => {
    return moment(date).startOf(ISO_WEEK).format(DATE_FORMAT);
}

export const endOf = (date, showWeekend) => {
    if (showWeekend)
        return moment(date).endOf(ISO_WEEK).format(DATE_FORMAT);
    else 
        return moment(date).endOf(ISO_WEEK).subtract(2,'d').format(DATE_FORMAT);

}

// Get first day (Monday) of the current week as the minimum available date
export const minBookDate = () => {
    return moment().format(DATE_FORMAT);
}

export const addWeek = (stringDate) => {
    return moment(stringDate).add(1, WEEKS).format(DATE_FORMAT);
    
};

export const subtractWeek = (stringDate) => {
    const subtractedWeek =
        moment(stringDate).subtract(1, WEEKS).format(DATE_FORMAT);

    if (moment(subtractedWeek).diff(startOf(now()), 'd') >= 0) {
        return subtractedWeek;
    }
    return moment(stringDate).format(DATE_FORMAT);
};

export const convertTo = (stringDate, FORMAT) => {
    return moment(new Date(stringDate)).format(FORMAT);
}

export const convertDateToTime = (stringDate) => {
    return moment(stringDate).format(TIME_FORMAT);
}

export const addHours = (currentDate, hoursToAdd) => {
    return moment(currentDate).add(hoursToAdd, HOURS);
}

 export const compareDates = (day1, day2) => {
    if(day2 != null){
        if(day2.includes('T')){
            const day2New = day2.substring(0, day2.indexOf('T'));
            return moment(day1).isSame(day2New, 'd');
        } else {
            return moment(day1).isSame(day2, 'd');
        }
        
    }
 }
 
 export const compareDatesExplicit = (day1, day2) => {
    return moment(day1).isSame(moment(day2), 'd');
 }