import { isWeekend, parse } from 'date-fns';
import { JcHoliday, JcResponse } from './hebcalClient';

export interface HmcHoliday extends JcHoliday {
  jsDate: Date; // JavaScript Date object
  hebrew_date: string; // Name of date in Hebrew letters, eg "א ניסן"
  hebrew_date_title: string; // Name of date in English letters, eg "1st of Nisan 5785"
  month: number; // Month of the holiday, 0-11
  isWeekend: boolean; // True if the holiday falls on a weekend
}

export const transformHolidays = (data: JcResponse): HmcHoliday[] => {
  const refDate = new Date(2025, 0, 1);
  const hebdates = data
    .items
    .filter(item => item.category == 'hebdate');

  const holidays = data
    .items
    .filter(item => item.category == 'holiday')
    .map(item => {
      const date = hebdates.find(el => el.date == item.date);
      if (!date) throw new Error(`No hebrew date found for holiday ${item.title} on ${item.date}`);

      const jsDate = parse(item.date, "yyyy-MM-dd", refDate);

      return Object.assign(
        item,
        {
          jsDate: jsDate,
          hebrew_date: date.hebrew,
          hebrew_date_title: date.title,
          month: jsDate.getMonth(),
          isWeekend: isWeekend(jsDate)
        }
      ) as HmcHoliday;
    });

  return holidays;
};

export const sortByMonth = (holidays: HmcHoliday[]): { [key: string]: HmcHoliday } => {
  let holidaysByMonth = {};
  let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  months.forEach(function (month, index) {
    holidaysByMonth[month] = holidays.filter(holiday => holiday.month == index);
  });

  return holidaysByMonth;
};

export const getHolidays = async (year: number, fnDownload: (year: number) => Promise<JcResponse>, cache: { getItem: (key: string) => string | null, setItem: (key: string, value: string) => void }) => {
  const cacheKey = `holidays-${year}`;
  const cachedData = cache.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const data = await fnDownload(year);
  const transformed = {
    all: transformHolidays(data),
    holidaysByMonth: sortByMonth(transformHolidays(data))
  };
  cache.setItem(cacheKey, JSON.stringify(transformed));

  return transformed;
};
