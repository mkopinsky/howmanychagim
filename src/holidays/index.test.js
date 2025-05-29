import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import downloadYearFromHebcal from './index';

describe('holidays', () => {
  describe('downloadYearFromHebcal', () => {
    let mockFnFetch;
    let mockLocalStorage;

    beforeEach(() => {
      mockFnFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ items: [] })
      });

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
      mockFnFetch.mockRestore();
    });

    it('fetches and organizes holidays from API if not cached', async () => {
      const testYears = {
        items: [
          { category: 'hebdate', date: '2025-04-23', hebrew: '15 Nisan 5785', title: '15 Nisan' },
          { category: 'holiday', date: '2025-04-23', title: 'Pesach I' }
        ]
      };
      mockFnFetch.mockResolvedValueOnce({
        json: () => Promise.resolve(testYears)
      });

      const data = await downloadYearFromHebcal(2025);

      expect(mockFnFetch).toHaveBeenCalled();
      expect(data.all.length).toBe(1);
      expect(data.all[0].title).toBe('Pesach I');
      expect(data.all[0].hebrew_date).toBe('15 Nisan 5785');
      expect(data.holidaysByMonth['April'].length).toBe(1);
    });

    it('throws and logs error if fetch fails', async () => {
      mockFnFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(downloadYearFromHebcal(2026)).rejects.toThrow('Network error');
    });
  });
});
