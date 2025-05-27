import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getHolidays, transformHolidays, sortByMonth } from './index';
import { createMockJcItem, createMockResponse } from './hebcalClient.testhelper';

describe('holidays', () => {
  describe('transformHolidays', () => {
    it('adds hebrew date and weekend data to holiday entries', () => {
      const date = new Date(2025, 3, 23);
      const holidayEntry = createMockJcItem({ category: 'holiday', date: date });
      const correspondingHebdate = createMockJcItem({ category: 'hebdate', date: date });
      const mockJcResponse = createMockResponse([correspondingHebdate, holidayEntry]);

      const transformed = transformHolidays(mockJcResponse);

      expect(transformed.length).toBe(1);
      expect(transformed[0].title).toBe(holidayEntry.title);
      expect(transformed[0].hebrew_date).toBe(correspondingHebdate.hebrew);
      expect(transformed[0].hebrew_date_title).toBe(correspondingHebdate.title);
      expect(transformed[0].jsDate).toEqual(date);
      expect(transformed[0].month).toBe(date.getMonth());
      expect(transformed[0].isWeekend).toBe(false);
    });

    it('filters out non-holiday items', () => {
      const mockJcResponse = createMockResponse([
        createMockJcItem({ category: 'hebdate' }),
        createMockJcItem({ category: 'roshchodesh' }),
        createMockJcItem({ category: 'parashat' }),
        createMockJcItem({ category: 'mevarchim' }),
        createMockJcItem({ category: 'holiday', title: 'test holiday entry' })
      ]);

      const transformed = transformHolidays(mockJcResponse);

      expect(transformed.length).toBe(1);
      expect(transformed[0].title).toBe('test holiday entry');
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

  describe('getHolidays', () => {
    let mockFnDownload;
    let mockCache;

    beforeEach(() => {
      mockFnDownload = vi.fn((key) => { });
      mockCache = (() => {
        let store = {};
        return {
          getItem: vi.fn((key) => store[key] || null),
          setItem: vi.fn((key, value) => { store[key] = value; }),
          clear: () => { store = {}; }
        };
      })();
    });

    it('fetches and organizes holidays from API if not cached', async () => {
      const holiday = createMockJcItem({ category: 'holiday', date: new Date(2000, 0, 1) });
      const correspondingHebdate = createMockJcItem({ category: 'hebdate', date: new Date(2000, 0, 1) });
      mockFnDownload.mockResolvedValueOnce(createMockResponse([holiday, correspondingHebdate]));
      mockCache.getItem.mockReturnValueOnce(null);

      const data = await getHolidays(2025, mockFnDownload, mockCache);

      expect(mockFnDownload).toHaveBeenCalled();
      expect(data.all.length).toBe(1);
      expect(data.all[0].title).toBe(holiday.title);
      expect(data.all[0].hebrew_date).toBe(correspondingHebdate.hebrew);
    });

    it('caches the fetched holidays', async () => {
      const mockJcResponse = createMockResponse([createMockJcItem({ category: 'holiday', title: 'Pesach I' })]);
      mockFnDownload.mockResolvedValueOnce(mockJcResponse);

      await getHolidays(2025, mockFnDownload, mockCache);

      expect(mockCache.setItem).toHaveBeenCalledWith('holidays-2025', expect.stringContaining('Pesach I'));
    });

    it('returns cached holidays if available', async () => {
      const cachedData = {};
      mockCache.getItem.mockReturnValueOnce(JSON.stringify(cachedData));

      const data = await getHolidays(2025, mockFnDownload, mockCache);

      expect(mockFnDownload).not.toHaveBeenCalled();
      expect(data).toStrictEqual(cachedData);
    });

    it('throws and logs error if fetch fails', async () => {
      mockFnDownload.mockRejectedValueOnce(new Error('Network error'));

      await expect(getHolidays(2026, mockFnDownload, mockCache)).rejects.toThrow('Network error');
    });
  });
});
