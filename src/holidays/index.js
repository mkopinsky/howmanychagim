
// TODO (maybe): fetch data via API rather than stored on disk
// https://www.hebcal.com/home/195/jewish-calendar-rest-api
// http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=now&month=x&ss=off&mf=on&c=off&geo=off&m=0&s=off&D=on
import data from './2018.json';
import parse from 'date-fns/parse';

// var  data = fetch('http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=now&month=x&ss=off&mf=on&c=off&geo=off&m=0&s=off&D=on');

function organize(data) {
  let hebdates = data
    .items
    .filter(item => item.category == 'hebdate');
  let holidays = data
    .items
    .filter(item => item.category == 'holiday')
    .map(item => {
      let date = hebdates.find(el => el.date == item.date);
      return Object.assign(
        item,
        {
          hebrew_date: date.hebrew,
          hebrew_date_title: date.title,
          month: parse(item.date).getMonth()
        }
      );
    });

  return holidays;
}
function sortByMonth(holidays) {
  let holidaysByMonth = {};
  let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach(function(month, index) {
    holidaysByMonth[month] = holidays.filter(holiday => holiday.month == index);
  });

  return holidaysByMonth;
}


export default function(year) {
  var url = 'https://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year='+year+'&month=x&ss=off&mf=on&c=off&geo=off&m=0&s=off&D=on';
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return {
        all: organize(data),
        holidaysByMonth: sortByMonth(organize(data))    
      };
    });
};
