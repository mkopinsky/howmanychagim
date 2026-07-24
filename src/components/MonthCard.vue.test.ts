// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import MonthCard from './MonthCard.vue';

import { useHmcState } from '../useHmcState.ts';
import { createMockHmcHoliday } from '../holidays/index.testhelper.ts';
import { HmcHoliday } from '../holidays/index.ts';
const hmcState = useHmcState();

describe('MonthCard.vue', () => {
    let wrapper;
    const monthProps: { month: string; holidays: HmcHoliday[] } = {
        month: 'April',
        holidays: []
    };

    beforeEach(async () => {
        monthProps.month = 'April';
        monthProps.holidays.length = 0;
        wrapper = mount(MonthCard, { props: monthProps });

        await wrapper.vm.$nextTick();
    });

    afterEach(() => {
        wrapper.unmount();
        vi.clearAllMocks();
    });

    it('renders checkbox for each holiday', async () => {
        const pesach1 = createMockHmcHoliday({ subcat: 'major', date: new Date(2025, 3, 23), title: 'Pesach I' });
        const pesach2 = createMockHmcHoliday({ subcat: 'major', date: new Date(2025, 3, 24), title: 'Pesach II' });
        const pesach3 = createMockHmcHoliday({ subcat: 'major', date: new Date(2025, 3, 25), title: 'Chol Hamoed I' });
        Array.prototype.push.apply(monthProps.holidays, [pesach1, pesach2, pesach3]);

        await wrapper.vm.$forceUpdate();

        const holidayLinks = wrapper.findAll('.days li a');
        expect(holidayLinks).toHaveLength(3);
        expect(holidayLinks[0].text()).toContain(pesach1.title);
        expect(holidayLinks[1].text()).toContain(pesach2.title);
        expect(holidayLinks[2].text()).toContain(pesach3.title);
    });

    it('toggles hmc state holiday selection when checkbox is clicked', async () => {
        const pesach = createMockHmcHoliday({ subcat: 'major', date: new Date(2025, 3, 23), title: 'Pesach I' });
        monthProps.holidays.push(pesach);
        await wrapper.vm.$forceUpdate();
        
        const pesachCheckbox = wrapper.find('input[type="checkbox"]');
        expect(pesachCheckbox.element.checked).toBe(false);
        expect(hmcState.selectedHolidays.value[pesach.date]).toBeFalsy();
        await pesachCheckbox.setValue(true);
        await wrapper.vm.$nextTick();

        expect(pesachCheckbox.element.checked).toBe(true);
        expect(hmcState.selectedHolidays.value[pesach.date]).toBe(true);
    });

    it('shows correct total weekdays and weekends for month', async () => {
        vi.spyOn(wrapper.vm, 'cntWeekdaysInMonth', 'get').mockReturnValue(20);
        vi.spyOn(wrapper.vm, 'cntWeekendsInMonth', 'get').mockReturnValue(10);
        
        await wrapper.vm.$forceUpdate();

        expect(wrapper.find('.month-header .badge.text-bg-warning').text()).toBe('20');
        expect(wrapper.find('.month-header .badge.text-bg-secondary').text()).toBe('10');
    });
});
