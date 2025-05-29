// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import App from './App.vue';

import { useHmcState } from './useHmcState.ts';
const hmcState = useHmcState();

describe('App.vue', () => {
  let wrapper;
  let selectedYearSpy;

  beforeEach(async () => {
    selectedYearSpy = vi.spyOn(hmcState.selectedYear, 'value', 'set');

    wrapper = mount(App);
    await wrapper.vm.$nextTick();
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  it('renders the title and year selector', async () => {
    expect(wrapper.text()).toContain('How many Chagim?');
    wrapper.vm.availableYears.forEach(year => {
      expect(wrapper.text()).toContain(year.toString());
    });
    expect(wrapper.html()).toContain('Total:');
  });

  it('sets hmc state selected year to current year on mount', async () => {
    const extraWrapper = mount(App);

    await extraWrapper.vm.$nextTick();

    expect(selectedYearSpy).toHaveBeenCalledWith(new Date().getFullYear());
    extraWrapper.unmount();
  });

  it('sets hmc state when a different year is selected', async () => {
    const nextYear = new Date().getFullYear() + 1;
    const yearLinks = wrapper.findAll('.year-selector a');
    const nextYearLink = yearLinks.find(a => a.text() == nextYear.toString());

    await nextYearLink.trigger('click');

    expect(selectedYearSpy).toHaveBeenCalledWith(nextYear);
  });

  it('shows correct total weekdays and weekends', async () => {
    vi.spyOn(hmcState.totalWeekdays, 'value', 'get').mockReturnValue(5);
    vi.spyOn(hmcState.totalWeekends, 'value', 'get').mockReturnValue(3);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.year-selector ~ div .badge.text-bg-warning').text()).toBe('5');
    expect(wrapper.find('.year-selector ~ div .badge.text-bg-secondary').text()).toBe('3');
  });
});