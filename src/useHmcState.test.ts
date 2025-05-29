import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHmcState } from './useHmcState';
import { nextTick } from 'vue';

vi.mock('./holidays/index', () => ({
    getHolidays: vi.fn()
}));

import { getHolidays } from './holidays/index';
import { createMockHmcHoliday } from './holidays/index.testhelper';

let mockLocalStorage: Storage;
describe('createHmcState', () => {
    beforeEach(() => {
        const mockHolidays = [
            createMockHmcHoliday({ subcat: 'major', date: new Date(2025, 3, 13), title: 'Passover I', isWeekend: true, isYomTov: true }),
            createMockHmcHoliday({ subcat: 'major', date: new Date(2025, 3, 14), title: 'Passover II', isWeekend: false, isYomTov: true }),
            createMockHmcHoliday({ subcat: 'minor', date: new Date(2025, 3, 15), title: 'Chol Hamoed I', isWeekend: false, isYomTov: false })
        ];
        const mockHolidaysData = {
            all: [...mockHolidays],
            holidaysByMonth: {
                April: [...mockHolidays]
            }
        };

        (getHolidays as any).mockResolvedValue(mockHolidaysData);
        mockLocalStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            clear: vi.fn(),
            key: vi.fn(),
            removeItem: vi.fn(),
            length: 0
        };
        globalThis.localStorage = mockLocalStorage;
    });

    it('initializes with correct years and empty holidays', () => {
        const currentYear = new Date().getFullYear();

        const state = createHmcState();

        expect(state.availableYears).toEqual([currentYear - 1, currentYear, currentYear + 1, currentYear + 2]);
        expect(state.holidays.value.all.length).toEqual(0);
        expect(state.selectedYear.value).toBe(0);
        expect(Object.keys(state.selectedHolidays.value).length).toBe(0);
        expect(state.totalWeekdays.value).toBe(0);
        expect(state.totalWeekends.value).toBe(0);
    });

    it('loads holidays and sets selectedHolidays when selectedYear changes', async () => {
        const state = createHmcState();
        
        state.selectedYear.value = 1900;
        await nextTick();

        expect(getHolidays).toHaveBeenCalledWith(1900, expect.any(Function), mockLocalStorage);
        expect(state.holidays.value.all).toHaveLength(3);
        expect(state.selectedHolidays.value['2025-04-13']).toBe(true);
        expect(state.selectedHolidays.value['2025-04-14']).toBe(true);
        expect(state.selectedHolidays.value['2025-04-15']).toBe(false);
    });

    it('computes totalWeekdays and totalWeekends correctly', async () => {
        const state = createHmcState();
        state.selectedYear.value = 2025;
        await nextTick();
        state.selectedHolidays.value['2025-04-13'] = true;
        state.selectedHolidays.value['2025-04-14'] = true;
        state.selectedHolidays.value['2025-04-15'] = true;
        await nextTick();
        
        expect(state.totalWeekdays.value).toBe(2);
        expect(state.totalWeekends.value).toBe(1);

        state.selectedHolidays.value['2025-04-13'] = false;
        state.selectedHolidays.value['2025-04-14'] = false;
        state.selectedHolidays.value['2025-04-15'] = false;
        await nextTick();
        expect(state.totalWeekdays.value).toBe(0);
        expect(state.totalWeekends.value).toBe(0);
    });
});