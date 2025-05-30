import { ref, computed, watch, Ref, ComputedRef } from 'vue';
import { getHolidays, HmcHoliday } from './holidays/index';
import { getYear } from './holidays/hebcalClient';
import _keyby from 'lodash.keyby';
import _mapValues from 'lodash.mapvalues';
import _uniq from 'lodash.uniq';

export interface HmcHolidaysDto {
  all: HmcHoliday[],
  holidaysByMonth: { [key: string]: HmcHoliday[] };
}

export interface HmcSelectedHolidaysDto {
  [key: string]: boolean;
}

export interface HmcState {
  availableYears: number[];
  holidays: Ref<HmcHolidaysDto, HmcHolidaysDto>,
  totalWeekdays: ComputedRef<number>,
  totalWeekends: ComputedRef<number>,
  selectedYear: Ref<number, number>,
  selectedHolidays: Ref<HmcSelectedHolidaysDto, HmcSelectedHolidaysDto>,
  workdays: Ref<number[]>
}

let instance: HmcState | null = null;
export const useHmcState = () => {
  if (instance === null) {
    instance = createHmcState();
  }

  return instance;
}

export const createHmcState = (): HmcState => {
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  const selectedYear = ref<number>(0);

  const holidays = ref<HmcHolidaysDto>({
    all: [],
    holidaysByMonth: {}
  });
  const selectedHolidays = ref<HmcSelectedHolidaysDto>({});

  const workdays = ref<number[]>([1, 2, 3, 4, 5]);

  watch(selectedYear, async () => {
    const data = await getHolidays(selectedYear.value, getYear, localStorage);
    holidays.value.all = data.all;
    holidays.value.holidaysByMonth = data.holidaysByMonth;

    Object.keys(selectedHolidays.value).forEach(key => delete selectedHolidays.value[key]);
    Object.assign(selectedHolidays.value, _mapValues(
      _keyby(data.all, 'date'),
      holiday => !!holiday.yomtov
    ));
  });

  const totalWeekdays = computed(() => {
    return _uniq(
      holidays.value.all
        .filter(h => workdays.value.includes(new Date(h.jsDate).getDay()) && selectedHolidays.value[h.date])
        .map(h => h.date)
    ).length;
  });

  const totalWeekends = computed(() => {
    return _uniq(
      holidays.value.all
        .filter(h => !workdays.value.includes(new Date(h.jsDate).getDay()) && selectedHolidays.value[h.date])
        .map(h => h.date)
    ).length;
  });

  return {
    availableYears,
    holidays,
    totalWeekdays,
    totalWeekends,
    selectedYear,
    selectedHolidays,
    workdays
  };
}
