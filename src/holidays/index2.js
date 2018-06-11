
import hebcal from 'hebcal';
import _flatten from 'lodash.flatten';

// import _groupby from 'lodash.groupby';
// import _assign from 'lodash.assign';

var h = new hebcal(5778);
var exclusions = ['Erev Shabbat', 'Shabbat'];

var majorHolidaysByMonth = h.months.map(function(month) {
  let allEvents = _flatten(Object.keys(month.holidays).map(date => month.holidays[date]));
  return allEvents
    .filter(event => !event.IL_ONLY)
    .filter(event => exclusions.indexOf(event.getDesc()) == -1 );
    
  let holidays = Object.keys(month.holidays).map(function(date) {
    var events = month.holidays[date].filter(event => !event.IL_ONLY);
    return {
      date,
      description0: events[0].getDesc()
    };
  });
  return {
    name: month.days[0].getMonthName(),
    holidays
  };
});

// var majorHolidays = data.items
//   .filter(item => item.category == 'holiday' && item.subcat == 'major')
//   .map(function(item) {
//     return _assign(
//       item,
//       {
//         month: getHebMonth(item.date)
//       }
//     )
//   });

majorHolidays = _groupby(majorHolidays, 'month');

export default {
  majorHolidays,
}