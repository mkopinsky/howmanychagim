import { isWeekend } from 'date-fns';
import parse from 'date-fns/parse';

export const transformHolidays = (data) => {
  let refDate = new Date(2025, 0, 1);
  let hebdates = data
    .items
    .filter(item => item.category == 'hebdate');
  let holidays = data
    .items
    .filter(item => item.category == 'holiday')
    .map(item => {
      let date = hebdates.find(el => el.date == item.date);
      let jsDate = parse(item.date, "yyyy-MM-dd", refDate);
      return Object.assign(
        item,
        {
          jsDate: jsDate,
          hebrew_date: date.hebrew,
          hebrew_date_title: date.title,
          month: jsDate.getMonth(),
          isWeekend: isWeekend(jsDate)
        }
      );
    });

  return holidays;
};

export const sortByMonth = (holidays) => {
  let holidaysByMonth = {};
  let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach(function(month, index) {
    holidaysByMonth[month] = holidays.filter(holiday => holiday.month == index);
  });

  return holidaysByMonth;
};

export const downloadYearFromHebcal = async (year) => {
  const url = `https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=${year}&month=x&ss=off&mf=on&c=off&geo=off&m=0&s=off&D=on`;
  
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

export default function(year, fnDownload) {
  return fnDownload(year)
    .then(data => {
      return {
        all: transformHolidays(data),
        holidaysByMonth: sortByMonth(transformHolidays(data))    
      };
    });
};
