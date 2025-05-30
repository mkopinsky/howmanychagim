// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WorkdaysSelector from './WorkdaysSelector.vue';

import { useHmcState } from '../useHmcState';

describe('WorkdaysSelector.vue', () => {
  it('renders checkboxes for each day', async () => {
    const state = useHmcState();
    state.workdays.value = [1, 2, 3, 4, 5];

    const wrapper = mount(WorkdaysSelector);

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes).toHaveLength(7);
    for(let i = 1; i<=5; i++) expect(checkboxes[i].element.checked).toBe(true);
    expect(checkboxes[0].element.checked).toBe(false);
    expect(checkboxes[6].element.checked).toBe(false);
  });

  it('toggles workdays on checkbox check', async () => {
    const state = useHmcState();
    state.workdays.value = [1, 2, 3, 4, 5];
    const wrapper = mount(WorkdaysSelector);
    const checkboxes = wrapper.findAll('input[type="checkbox"]');

    await checkboxes[0].setChecked(true);
    await checkboxes[1].setChecked(false);
    
    expect(state.workdays.value).toContain(0);
    expect(state.workdays.value).not.toContain(1);
  });
});