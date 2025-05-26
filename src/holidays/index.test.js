import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { default as getHolidays, downloadYearFromHebcal, transformHolidays, sortByMonth } from './index';

describe('holidays', () => {
  describe('transformHolidays', () => {
    it('adds hebrew date and weekend data to holiday entries', () => {
      const date = new Date(2025, 3, 23);
      const strdate = date.toISOString().split('T')[0];
      const hebdateEntry = { category: 'hebdate', date: strdate, hebrew: '15 Nisan 5785', title: '15 Nisan' };
      const holidayEntry = { category: 'holiday', date: strdate, title: 'Pesach I' };
      const data = {
        items: [
          hebdateEntry,
          holidayEntry
        ]
      };

      const transformed = transformHolidays(data);

      expect(transformed.length).toBe(1);
      expect(transformed[0].title).toBe(holidayEntry.title);
      expect(transformed[0].hebrew_date).toBe(hebdateEntry.hebrew);
      expect(transformed[0].hebrew_date_title).toBe(hebdateEntry.title);
      expect(transformed[0].jsDate).toEqual(date);
      expect(transformed[0].month).toBe(date.getMonth());
      expect(transformed[0].isWeekend).toBe(false);
    });

    it('filters out non-holiday items', () => {
      const data = {
        items: [
          { category: 'hebdate', date: '2025-04-23', hebrew: '15 Nisan 5785', title: '15 Nisan' },
          { category: 'holiday', date: '2025-04-23', title: 'Pesach I' },
          { category: 'other', date: '2025-04-24', title: 'Some Other Event' }
        ]
      };

      const transformed = transformHolidays(data);

      expect(transformed.length).toBe(1);
      expect(transformed[0].title).toBe('Pesach I');
    });
  });

  describe('sortByMonth', () => {
    it('groups holidays by month', () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const holidays = [
        { title: 'Pesach I', month: 3 },
        { title: 'Yom Kippur', month: 8 },
        { title: 'Rosh Hashanah', month: 8 },
        { title: 'Sukkot', month: 9 }
      ];

      const grouped = sortByMonth(holidays);

      expect(Object.keys(grouped).length).toBe(12);
      months.forEach((name, ix) => {
        expect(grouped[name]).toBeDefined();
        expect(grouped[name].length).toBe(holidays.filter(h => h.month === ix).length);
      });
    });
  });

  describe('downloadYearFromHebcal', () => {
    let mockFnFetch;

    beforeEach(() => {
      mockFnFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ items: [] })
      });
    });

    afterEach(() => {
      mockFnFetch.mockRestore();
    });

    it('fetches data for a given year from Hebcal', async () => {
      const mockResponse = {};
      mockFnFetch.mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
      });

      const data = await downloadYearFromHebcal(2025);

      expect(mockFnFetch).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/www\.hebcal\.com\/hebcal.*year=2025.*/));
      expect(data).toStrictEqual(mockResponse);
    });
  });

  describe('default (getHolidays)', () => {
    let mockFnDownload;
    let mockLocalStorage;

    beforeEach(() => {
      mockFnDownload = vi.fn((key) => {});

      mockLocalStorage = (() => {
        let store = {};
        return {
          getItem: vi.fn((key) => store[key] || null),
          setItem: vi.fn((key, value) => { store[key] = value; }),
          clear: () => { store = {}; }
        };
      })();
      Object.defineProperty(global, 'localStorage', {
        value: mockLocalStorage,
        configurable: true
      });
    });

    afterEach(() => {
    });

    it('fetches and organizes holidays from API if not cached', async () => {
      const testYears = {
        items: [
          { category: 'hebdate', date: '2025-04-23', hebrew: '15 Nisan 5785', title: '15 Nisan' },
          { category: 'holiday', date: '2025-04-23', title: 'Pesach I' }
        ]
      };
      mockFnDownload.mockResolvedValueOnce(testYears);

      const data = await getHolidays(2025, mockFnDownload);

      expect(mockFnDownload).toHaveBeenCalled();
      expect(data.all.length).toBe(1);
      expect(data.all[0].title).toBe('Pesach I');
      expect(data.all[0].hebrew_date).toBe('15 Nisan 5785');
      expect(data.holidaysByMonth['April'].length).toBe(1);
    });

    it('throws and logs error if fetch fails', async () => {
      mockFnDownload.mockRejectedValueOnce(new Error('Network error'));

      await expect(getHolidays(2026, mockFnDownload)).rejects.toThrow('Network error');
    });
  });
});
