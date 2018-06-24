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
            <label for="inputEmail3" class="col-sm-3 col-form-label">Select a Year</label>
            <div class="col-sm-9 btn-group-toggle btn-group" data-toggle="buttons">
              <label v-for="year in availableYears" class="btn btn-outline-primary" :class="{active: year==selectedYear}">
                <input type="radio" :value="year" v-model="selectedYear" />
                {{ year }}
              </label>
            </div>
          </div>
        </div>
        <h4 class="card-footer mb-0">
          Total: <span class="badge badge-warning">{{totalWeekdays()}}</span> work days
        </h4>
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
<!-- 
        <div class="form-check" v-for="year in availableYears">
          <label class="form-check-label">
          <input class="form-check-input" type="radio" name="year" :value="year" v-model="selectedYear" />
            {{year}}
          </label>
        </div>
 -->
      </div>

    </div>
    <div class="row">

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
import isWeekend from 'date-fns/is_weekend';

export default {
  name: 'app',
  data () {
    return {
      availableYears: ['2018', '2019', '2020'],
      selectedYear: '2018',
      holidays: {
        all: [],
        holidaysByMonth: {}
      },
      selected: {}
    };
  },
  mounted() {
    this.reloadHolidays()
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
