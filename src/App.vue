<template>
  <div id="app">
    <CornerBanner url="https://github.com/mkopinsky/howmanychagim"/>
    <div class="top">
      <h1>How many Chagim?</h1>
      <h3 class="year-selector">
        <a
            v-for="year in availableYears"
            :class="{'px-1': true, 'active': year===selectedYear}"
            href="#"
            @click.prevent="() => selectedYear = year"
        >{{ year }}</a>
      </h3>
      <WorkdaysSelector />
      <div class="mb-3">
        <h4>
          Total: <span class="badge text-bg-warning">{{ totalWeekdays }}</span> work days,
          <span class="badge text-bg-secondary">{{ totalWeekends }}</span> weekends
        </h4>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="(holidaysList, month) in holidays.holidaysByMonth" :key="month">
        <MonthCard
          :month="month"
          :holidays="holidaysList"
          :onToggle="toggle"
        />
      </div>
    </div>
    <div id="footer" class="text-center">
      &copy; 2018 Michael Kopinsky. Licensed under MIT.
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHmcState } from './useHmcState';
import MonthCard from './components/MonthCard.vue';
import CornerBanner from './CornerBanner.vue';
import WorkdaysSelector from './components/WorkdaysSelector.vue';

const {
  availableYears,
  holidays,
  totalWeekdays,
  totalWeekends,
  selectedYear
} = useHmcState();

onMounted(() => {
  selectedYear.value = new Date().getFullYear();
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 60px 30px 20px;

  .top {
    text-align: center;

    .year-selector .active {
      text-decoration: underline dotted;
      color: black;
    }
  }

  .card {
    margin-bottom: 20px;
  }

  ul.days {
    li {
      display: block;

      &.yt {
        font-weight: bold;
      }
    }
  }

  span.total {
    font-weight: bold;
  }
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
