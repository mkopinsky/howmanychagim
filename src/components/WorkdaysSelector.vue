<template>
  <div class="workdays-selector">
    <label v-for="(day, idx) in daysOfWeekNames" :key="idx" class="me-2">
      <input
        type="checkbox"
        :value="idx"
        :checked="workdays.includes(idx)"
        @change="toggleDay(idx, $event)"
      />
      {{ day }}
    </label>
  </div>
</template>

<script setup>
import { useHmcState } from '../useHmcState';
const { workdays } = useHmcState();

const daysOfWeekNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const toggleDay = (idx, event) => {
  const checked = event.target.checked;
  if (checked && !workdays.value.includes(idx)) {
    workdays.value.push(idx);
    workdays.value.sort((a, b) => a - b);
  } else if (!checked && workdays.value.includes(idx)) {
    workdays.value.splice(workdays.value.indexOf(idx), 1);
  }
};
</script>

<style scoped>
.workdays-selector {
  margin-bottom: 1em;
}
</style>