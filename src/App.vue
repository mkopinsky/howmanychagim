<template>
  <div id="app">
    <div class="top">
      <h1>How many Chagim?</h1>
      <h3 class="year-selector">
        <a 
          v-for="year in availableYears" 
          :class="{'px-1': true, 'active': year==selectedYear}"
          href="#"
          @click="selectYear(year)"
        >{{year}}</a>
      </h3>
      <div class="grand-totals mb-3">
        <h4>
          Total: <span class="badge badge-warning">{{totalWeekdays()}}</span> work days,
          <span class="badge badge-secondary">{{totalWeekends()}}</span> weekends
        </h4>
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
