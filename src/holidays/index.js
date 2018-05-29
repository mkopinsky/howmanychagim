
// TODO: fetch data via API rather than stored on disk
// https://www.hebcal.com/home/195/jewish-calendar-rest-api
// http://www.hebcal.com/hebcal/?v=1&cfg=json&maj=on&min=on&mod=on&nx=off&year=now&month=x&ss=off&mf=on&c=off&geo=off&m=0&s=off&D=on
import data from './2018.json';

// import hebcal from 'hebcal';
// var h = new hebcal.GregYear(2018);
// var holidays = h.holidays;

import _groupby from 'lodash.groupby';
import _assign from 'lodash.assign';

var hebdates =  data.items.filter(item => item.category == 'hebdate');
var getHebdate = function(date) {
  return hebdates.find(el => el.date == date);
}
var getHebMonth = function(date) {
  return getHebdate(date)
    .title
    .match(/of ([^ ,]*)/)[1];
}

var majorHolidays = data.items
  .filter(item => item.category == 'holiday' && item.subcat == 'major')
  .map(function(item) {
    return _assign(
      item,
      {
        month: getHebMonth(item.date)
      }
    )
  });

majorHolidays = _groupby(majorHolidays, 'month');

export default {
  raw: data,
  hebdates,
  majorHolidays,
}