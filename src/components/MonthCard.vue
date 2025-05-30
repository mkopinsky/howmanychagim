<template>
  <div class="card">
    <h5 class="card-header month-header">
      {{ month }}
      <span class="float-end">
        <span class="badge text-bg-warning me-1">{{ cntWeekdaysInMonth }}</span>
        <span class="badge text-bg-secondary">{{ cntWeekendsInMonth }}</span>
      </span>
    </h5>
    <div class="card-body">
      <p v-if="holidays.length == 0">No chagim in {{ month }}!</p>
      <ul class="days list-unstyled">
        <li v-for="holiday in holidays" :key="holiday.date" :class="{yt: holiday.yomtov}">
          <label>
            <input type="checkbox" :checked="selectedHolidays[holiday.date]" @change="(e) => selectedHolidays[holiday.date] = e.target.checked" />
            {{ formatDate(holiday.jsDate) }}
            (<a :href="holiday.link" :title="JSON.stringify(holiday)" target="_blank">{{ holiday.title }}</a>)
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useHmcState } from '../useHmcState';
import format from 'date-fns/format';
import _uniq from 'lodash.uniq';

const props = defineProps({
  month: String,
  holidays: Array
});

const {
    selectedHolidays
} = useHmcState();

const cntWeekdaysInMonth = computed(() =>
  _uniq(props.holidays.filter(h => !h.isWeekend && selectedHolidays.value[h.date]).map(h => h.date)).length
);

const cntWeekendsInMonth = computed(() =>
  _uniq(props.holidays.filter(h => h.isWeekend && selectedHolidays.value[h.date])).map(h => h.date).length
);

function formatDate(date) {
  return format(date, 'ccc MMM do');
}
</script>