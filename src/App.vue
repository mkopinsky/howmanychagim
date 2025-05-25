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
            @click="selectYear(year)"
        >{{ year }}</a>
      </h3>
      <div class="mb-3">
        <h4>
          Total: <span class="badge text-bg-warning">{{ totalWeekdays() }}</span> work days,
          <span class="badge text-bg-secondary">{{ totalWeekends() }}</span> weekends
        </h4>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="holidays, month in holidays.holidaysByMonth">
        <div class="card">
          <h5 class="card-header month-header">
            {{ month }}
            <span class="float-end">
              <span class="badge text-bg-warning me-1">{{ totalWeekdays(month) }}</span>
              <span class="badge text-bg-secondary">{{ totalWeekends(month) }}</span>
            </span>
          </h5>
          <div class="card-body">
            <p v-if="holidays.length == 0">No chagim in {{ month }}!</p>
            <ul class="days">
              <li v-for="holiday in holidays" :class="{yt: holiday.yomtov}">
                <label>
                  <input type="checkbox" :checked="selected[holiday.date]" @input="toggle(holiday.date, $event)"/>
                  {{ format(holiday.jsDate) }}
                  (<a :href="holiday.link" :title="JSON.stringify(holiday)" target="_blank">{{ holiday.title }}</a>)
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="footer" class="text-center">
      &copy; 2018 Michael Kopinsky. Licensed under MIT.
    </div>
  </div>
</template>

<script>

import getHolidays from './holidays';
import format from 'date-fns/format';
import _keyby from 'lodash.keyby';
import _mapValues from 'lodash.mapvalues';
import _uniq from 'lodash.uniq';
import CornerBanner from './CornerBanner.vue';

export default {
  name: 'app',
  components: {CornerBanner},
  data() {
    const currentYear = new Date().getFullYear();
    return {
      availableYears: [currentYear - 1, currentYear, currentYear + 1, currentYear + 2],
      selectedYear: currentYear,
      holidays: {
        all: [],
        holidaysByMonth: {}
      },
      selected: {}
    };
  },
  mounted() {
    this.reloadHolidays();
  },
  methods: {
    reloadHolidays() {
      getHolidays(this.selectedYear).then(holidays => {
        this.holidays = holidays;
        this.selected = _mapValues(
            _keyby(this.holidays.all, 'date'),
            // Default to selecting yomtov days
            holiday => !!holiday.yomtov
        );
      });
    },
    format(date) {
      return format(date, 'ccc MMM do');
    },
    selectYear(year) {
      this.selectedYear = year;
      this.reloadHolidays();
    },
    toggle(date, event) {
      this.selected[date] = event.target.checked;
    },
    totalWeekdays(month) {
      let holidays = month
          ? this.holidays.holidaysByMonth[month]
          : this.holidays.all;

      return _uniq(
          holidays
              .filter(holiday => !holiday.isWeekend && this.selected[holiday.date])
      ).length;
    },
    totalWeekends(month) {
      let holidays = month
          ? this.holidays.holidaysByMonth[month]
          : this.holidays.all;

      return _uniq(
          holidays
              .filter(holiday => holiday.isWeekend && this.selected[holiday.date])
      ).length;
    }
  }
};
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
