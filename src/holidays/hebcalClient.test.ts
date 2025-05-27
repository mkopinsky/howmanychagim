import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getYear } from './hebcalClient';

describe('getYear', () => {
    let mockFnFetch;

    beforeEach(() => {
      mockFnFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
        json: () => Promise.resolve({ items: [] })
      } as Response);
    });

    afterEach(() => {
      mockFnFetch.mockRestore();
    });

    it('fetches data for a given year from Hebcal', async () => {
      const mockResponse = {};
      mockFnFetch.mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
      } as Response);

      const data = await getYear(2025);

      expect(mockFnFetch).toHaveBeenCalledWith(expect.stringMatching(/^https:\/\/www\.hebcal\.com\/hebcal.*year=2025.*/));
      expect(data).toStrictEqual(mockResponse);
    });
  });