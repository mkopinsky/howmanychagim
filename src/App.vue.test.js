// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

vi.mock('./holidays', () => ({
  default: vi.fn()
}));

import getHolidays from './holidays';

const mockHolidays = {
  all: [
    {
      date: '2025-04-23',
      jsDate: new Date('2025-04-23'),
      title: 'Pesach I',
      yomtov: true,
      isWeekend: false,
      month: 3,
      link: 'https://example.com/pesach'
    },
    {
      date: '2025-04-26',
      jsDate: new Date('2025-04-26'),
      title: 'Shabbat Chol Hamoed',
      yomtov: false,
      isWeekend: true,
      month: 3,
      link: 'https://example.com/shabbat'
    }
  ],
  holidaysByMonth: {
    April: [
      {
        date: '2025-04-23',
        jsDate: new Date('2025-04-23'),
        title: 'Pesach I',
        yomtov: true,
        isWeekend: false,
        month: 3,
        link: 'https://example.com/pesach'
      },
      {
        date: '2025-04-26',
        jsDate: new Date('2025-04-26'),
        title: 'Shabbat Chol Hamoed',
        yomtov: false,
        isWeekend: true,
        month: 3,
        link: 'https://example.com/shabbat'
      }
    ]
  }
};

describe('App.vue', () => {
  let wrapper;

  beforeEach(async () => {
    getHolidays.mockResolvedValue(mockHolidays);

    wrapper = mount(App);
    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the title and year selector', async () => {
    expect(wrapper.text()).toContain('How many Chagim?');
    wrapper.vm.availableYears.forEach(year => {
      expect(wrapper.text()).toContain(year.toString());
    });
    expect(wrapper.html()).toContain('Total:');
  });

  it('calls getHolidays with the selected year on mount', async () => {
    const extraWrapper = mount(App);

    await extraWrapper.vm.$nextTick();

    expect(getHolidays).toHaveBeenCalledWith(new Date().getFullYear());
    extraWrapper.unmount();
  });

  it('updates holidays when a different year is selected', async () => {
    getHolidays.mockResolvedValueOnce(mockHolidays);

    const nextYear = new Date().getFullYear() + 1;
    const yearLinks = wrapper.findAll('.year-selector a');
    const nextYearLink = yearLinks.find(a => a.text() == nextYear.toString());
    await nextYearLink.trigger('click');

    expect(getHolidays).toHaveBeenCalledWith(nextYear);
  });

  it('toggles holiday selection when checkbox is clicked', async () => {
    const pesachCheckbox = wrapper.find('input[type="checkbox"]');
    expect(pesachCheckbox.element.checked).toBe(true);
    await pesachCheckbox.setValue(false);

    expect(wrapper.vm.selected['2025-04-23']).toBe(false);
  });

  it('shows correct total weekdays and weekends', async () => {
    wrapper.vm.selected[mockHolidays.all[0].date] = true;
    wrapper.vm.selected[mockHolidays.all[1].date] = true;

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.year-selector ~ div .badge.text-bg-warning').text()).toBe('1');
    expect(wrapper.find('.year-selector ~ div .badge.text-bg-secondary').text()).toBe('1');
    expect(wrapper.find('.month-header .badge.text-bg-warning').text()).toBe('1');
    expect(wrapper.find('.month-header .badge.text-bg-secondary').text()).toBe('1');
  });

  it('does not double count different holidays with the same date', async () => {
    const cm2 = {
      ...mockHolidays.all[1],
      title: '2nd Day of Chol Hamoed',
    };
    const extraPesachDef = {
      ...mockHolidays.all[0],
      title: 'Pesach I - Extra Definition'
    };
    getHolidays.mockResolvedValueOnce({ all: [...mockHolidays.all, cm2, extraPesachDef], holidaysByMonth: { April: [...mockHolidays.holidaysByMonth.April, cm2, extraPesachDef] } });
    wrapper.unmount();
    wrapper = mount(App);
    await wrapper.vm.$nextTick();
    wrapper.vm.selected[mockHolidays.all[0].date] = true;
    wrapper.vm.selected[mockHolidays.all[1].date] = true;

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.year-selector ~ div .badge.text-bg-warning').text()).toBe('1');
    expect(wrapper.find('.year-selector ~ div .badge.text-bg-secondary').text()).toBe('1');
    expect(wrapper.find('.month-header .badge.text-bg-warning').text()).toBe('1');
    expect(wrapper.find('.month-header .badge.text-bg-secondary').text()).toBe('1');
  });
});