<template>
  <div>
    <div class="month-container" v-for="month, i in text.months">
      <div class="month-body">
        <p>{{month}}</p>
        <div>
          <span v-for="w in text.daysOfWeek" class="dayOfWeekLabel">{{w}}</span>
        </div>
        <div>
          <span v-for="d in dateRange[i]" class="day-cell" :class="getClassesForDate(d.date, month)" @click="daySelect(d, $event)">
            <div>
              {{d.date.date()}}
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Much of this calendar component was copied from the vue2-slot-calendar, with modifications
 * to remove what I didn't need, and to better suit my needs for the parts I do need.
 * Original component is Copyright (c) 2018 Terry Cai, licensed under MIT.
 * 
 * https://registry.npmjs.org/vue2-slot-calendar
 */

import moment from 'moment';

export default {
  name: 'calendar',
  props: {
    selectedDays: {
      type: Object,
      default () {
        return {}
      }
    },
    year: {
      type: [Number, String]
    },
    getClassesForDate: {
      type: Function,
      default () {
        return function (date) {
          return '';
        }
      }
    }
  },
  mounted () {
    this.getDateRange();
  },
  data () {
    return {
      dateRange: [],
      text: {
        daysOfWeek: moment.weekdaysMin(),
        months: moment.months(),
      }
    };
  },
  methods: {
    daySelect(d, event) {
      this.$parent.toggle(d.date.format('YYYY-MM-DD'))
    },
    getDateRange() {
      this.dateRange = [];
      for (let p = 0; p < 12; p++) {
        this.dateRange[p] = []

        const currMonth = moment({year: this.year, month: p, day: 1});
        const prevMonth = moment(currMonth).subtract(1, 'month');
        const nextMonth = moment(currMonth).add(1, 'month');

        // Add any needed days from the previous month
        for (let i = 0; i < currMonth.day(); i++) {
          let date = moment(currMonth).subtract(currMonth.day() - i, 'days');
          this.dateRange[p].push({
            date: date,
            isCurrentMonth: false
          });
        }
        // Current month
        for (let i = 1; i <= currMonth.daysInMonth(); i++) {
          let date = moment(currMonth).date(i);
          this.dateRange[p].push({
            date: date,
            isCurrentMonth: true
          });
        }
        // Next month (if needed)
        const nextMonthNeed = (42 - this.dateRange[p].length) % 7;
        for (let i = 0; i < nextMonthNeed; i++) {
          let date = moment(nextMonth).date(i + 1);
          this.dateRange[p].push({
            date: date,
            isCurrentMonth: false
          })
        }
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../node_modules/bootstrap/scss/bootstrap";
/*!
 * Based on vue2-calendar v2.1.4
 * (c) 2018 Terry <gidcai@gmail.com>
 * https://github.com/icai/vue2-calendar#readme
 */
.month-container {
  width: 218px;
  float: left;
  min-height: 260px;
}
.month-body {
  padding: 10px 10px;
  text-align: center;

  span {
    display: inline-block;
    width: 28px;
    line-height: 28px;
    height: 28px;
    text-align: center;

    &.dayOfWeekLabel {
      font-weight: bold;
    }
    &.day-cell {
      cursor: pointer;

      &:hover {
        background-color: #eeeeee;
      }

      &.active:hover,
      &.active {
        background: $primary;
        border: 1px solid $primary;
        color: white;
      }
    }
  }
}
</style>