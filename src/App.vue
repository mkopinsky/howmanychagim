<template>
  <div id="app">
    <div class="top">
      <h1>How many Chagim?</h1>
    </div>
    <div class="col-lg-6 offset-lg-3">
      <div class="card">
        <h5 class="card-header d-none">
          Settings
        </h5>
        <div class="card-body">
          <div class="form-group row">
            <label class="col-sm-5 col-form-label">Select a Year</label>
            <div class="col-sm-7 btn-group-toggle btn-group" data-toggle="buttons">
              <label v-for="year in availableYears" class="btn btn-outline-primary" :class="{active: year==selectedYear}">
                <input type="radio" :value="year" v-model="selectedYear" />
                {{ year }}
              </label>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-5 col-form-label">Choose your Work Week</label>
            <div class="col-sm-7 btn-group-toggle btn-group" data-toggle="buttons">
              <label v-for="day, i in weekdays" class="btn btn-outline-primary" @click="toggleDay(day)" :class="{active: settings.weekdays[day]}">
                {{day[0]}}
              </label>
            </div>
          </div>

          <div class="form-group row">
            <label class="col-sm-5 col-form-label">What will you take off?</label>
            <div class="col-sm-7">
              <div class="form-check">
                <input class="form-check-input" type="checkbox"  id="defaultCheck1" checked>
                <label class="form-check-label" for="defaultCheck1">
                  Yom tov
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="defaultCheck2">
                <label class="form-check-label" for="defaultCheck2">
                  Chol Hamoed
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="defaultCheck3">
                <label class="form-check-label" for="defaultCheck3">
                  Purim
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="defaultCheck4" checked>
                <label class="form-check-label" for="defaultCheck4">
                  Tisha B'av
                </label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="defaultCheck5">
                <label class="form-check-label" for="defaultCheck5">
                  Minor Fast Days
                </label>
              </div>

            </div>
          </div>

        </div>
        <div class="card-footer mb-0">
          <h4>Total: <span class="badge badge-warning">{{totalWeekdays()}}</span> work days</h4>
          <ul>
            <li v-for="holidays, month in selectedHolidaysByMonth" v-if="holidays.length > 0">
              {{ month }}:
              <span v-for="holiday, i in holidays">
                <span style="border-bottom: 1px dotted black" v-b-tooltip.hover :title="holiday.title">
                  {{ formatShort(holiday.date) }}
                </span>
                <span v-if="i < holidays.length - 1">, </span>
              </span>

            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="row d-none">
      <div class="col-lg-3">
        <h2>Select a year</h2>
        <div class="btn-group-toggle btn-group" data-toggle="buttons">
          <label v-for="year in availableYears" class="btn btn-outline-primary" :class="{active: year==selectedYear}">
            <input type="radio" :value="year" v-model="selectedYear" />
            {{ year }}
          </label>
        </div>
      </div>

    </div>
    <div class="row col-lg-9 offset-lg-2 text-center">
      <h4>Adjust your days off</h4>
      <calendar
        value="2018-01-02"
        :hasInput="false"
        :pane="12"
      />
    </div>
    <div class="row d-none">

      <div class="col-lg-3 col-sm-6" v-for="holidays, month in holidays.holidaysByMonth">
        <div class="card">
          <h5 class="card-header">
            {{month}}
            <span class="float-right">
              <span class="badge badge-warning">{{ totalWeekdays(month) }}</span>
              <span class="badge badge-secondary">{{ totalWeekends(month) }}</span>
            </span>
          </h5>
          <div class="card-body">
            <p v-if="holidays.length == 0">No chagim in {{month}}!</p>
            <ul class="days">
              <li v-for="holiday in holidays" :class="{yt: holiday.yomtov}">
                <label>
                  <input type="checkbox" :checked="selected[holiday.date]" @input="toggle(holiday.date, $event)" />
                  {{ format(holiday.date) }}
                  (<a :href="holiday.link" :title="JSON.stringify(holiday)" target="_blank">{{holiday.title}}</a>)
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="footer" class="text-center mt-4">
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
import isWeekend from 'date-fns/is_weekend';
import moment from 'moment';

import 'vue2-slot-calendar/lib/calendar.min.css';
import calendar from 'vue2-slot-calendar/lib/calendar';

export default {
  name: 'app',
  data () {
    return {
      availableYears: ['2018', '2019', '2020'],
      weekdays: moment.weekdays(),
      settings: {
        year: 2018,
        weekdays: {
          'Sunday': false,
          'Monday': true,
          'Tuesday': true,
          'Wednesday': true,
          'Thursday': true,
          'Friday': true,
          'Saturday': false,
        }
      },
      selectedYear: '2018',
      holidays: {
        all: [],
        holidaysByMonth: {}
      },
      selected: {}
    };
  },
  components: {
      calendar
  },
  mounted() {
    this.reloadHolidays()
  },
  computed: {
    selectedHolidaysByMonth() {
      return _mapValues(
        this.holidays.holidaysByMonth,
          holidays => holidays.filter(holiday => this.selected[holiday.date])
        );
    },

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
      return format(date, 'ddd MMM Do')
    },
    formatShort(date) {
      return format(date, 'ddd Do')
    },
    selectYear(year) {
      this.selectedYear = year;
      this.reloadHolidays();
    },
    toggleDay(day) {
      this.settings.weekdays[day] = !this.settings.weekdays[day];
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
        .map(holiday => holiday.date)
        .filter(date => this.selected[date])
        .filter(date => !isWeekend(date))
      ).length;
    },
    totalWeekends(month) {
      let holidays = month 
        ? this.holidays.holidaysByMonth[month]
        : this.holidays.all;

      return _uniq(
        holidays
        .map(holiday => holiday.date)
        .filter(date => this.selected[date])
        .filter(isWeekend)
      ).length;
    }
  }
}
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
