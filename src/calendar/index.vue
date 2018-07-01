<template>
  <div>
    <div class="month-container" v-for="month, i in text.months">
      <div class="month-body">
        <p>{{month}}</p>
        <div class="dayOfWeekLabels">
          <span v-for="w in text.daysOfWeek">{{w}}</span>
        </div>
        <div>
          <span v-for="d in dateRange[i]" class="day-cell" :class="getItemClasses(d)" @click="daySelect(d, $event)">
            <div>
                {{d.text}}
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
    }
  },
  mounted () {
    this.getDateRange();
  },
  data () {
    return {
      dateRange: [],
      currDate: new Date(this.year, 0, 1),
      text: {
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      }
    };
  },
  methods: {
    getItemClasses (d) {
      const dateStr = d.date.toJSON().substring(0,10);
      let classes = ['datepicker-item'];
      if (!d.isCurrentMonth) {
        classes.push('gray');
      } else if (this.selectedDays[dateStr]) {
        classes.push('active');
      }

      if ('isWeekend') {
        classes.push('datepicker-weekend');
      }
      if ('isSelected') {
        // classes.push('datepicker-dateRange-item-active');
      }
      if ('isYomTov') {
        classes.push('datepicker-yomtov');
      } else if ('isChag') {
        classes.push('datepicker-holiday')
      }

      return classes.join(' ');
    },
    daySelect(d, event) {
      // TODO: emit an event to parent
    },
    getDayCount (year, month) {
      const dict = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month === 1) {
        if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
          return 29;
        }
      }
      return dict[month];
    },
    getYearMonth (year, month) {
      if (month > 11) {
        year++;
        month = 0;
      } else if (month < 0) {
        year--;
        month = 11;
      }
      return {year: year, month: month};
    },
    getDateRange() {
      this.dateRange = []
      for (let p = 0; p < 12; p++) {
        let currMonth = new Date(2018, p);
        let time = {
          year: currMonth.getFullYear(),
          month: currMonth.getMonth()
        }
        this.dateRange[p] = []
        const currMonthFirstDay = new Date(time.year, time.month, 1)
        let firstDayWeek = currMonthFirstDay.getDay() + 1
        if (firstDayWeek === 0) {
          firstDayWeek = 7
        }
        const dayCount = this.getDayCount(time.year, time.month)
        if (firstDayWeek > 1) {
          const preMonth = this.getYearMonth(time.year, time.month - 1)
          const prevMonthDayCount = this.getDayCount(preMonth.year, preMonth.month)
          for (let i = 1; i < firstDayWeek; i++) {
            const dayText = prevMonthDayCount - firstDayWeek + i + 1
            this.dateRange[p].push({
              text: dayText,
              date: new Date(preMonth.year, preMonth.month, dayText),
              isCurrentMonth: false
            })
          }
        }
        for (let i = 1; i <= dayCount; i++) {
          const date = new Date(time.year, time.month, i)
          const week = date.getDay()
          this.dateRange[p].push({
            text: i,
            date: date,
            isCurrentMonth: true
          })
        }
        if (this.dateRange[p].length < 42) {
          const nextMonthNeed = (42 - this.dateRange[p].length) % 7;
          const nextMonth = this.getYearMonth(time.year, time.month + 1)
          for (let i = 1; i <= nextMonthNeed; i++) {
            this.dateRange[p].push({
              text: i,
              date: new Date(nextMonth.year, nextMonth.month, i),
              isCurrentMonth: false
            })
          }
        }
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
/*!
 * Based on vue2-calendar v2.1.4
 * (c) 2018 Terry <gidcai@gmail.com>
 * https://github.com/icai/vue2-calendar#readme
 */
.month-container {
  width: 218px;
  float: left;
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

    .dayOfWeekLabels & {
      font-weight: bold;
    }
    &.day-cell {
      cursor: pointer;

      &:hover {
        background-color: #eeeeee;
      }

      &.gray {
        color: #999;
      }
      &.active:hover,
      &.active {
        background: #3276b1;
        color: white;
      }
    }
  }
}
</style>