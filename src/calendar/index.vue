<template>
  <div>
    <div class="datepicker-inner" v-for="month, i in text.months">
      <div class="datepicker-body">
        <p>{{month}}</p>
        <div class="datepicker-weekRange">
          <span v-for="w in text.daysOfWeek">{{w}}</span>
        </div>
        <div class="datepicker-dateRange">
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
      let classes = [];
      if (!d.isCurrentMonth) {
        classes.push('datepicker-item-gray');
      }
      // debugger;
      // TODO: set 'datepicker-dateRange-item-active' class on selected days
      else if (this.selectedDays[dateStr]) {
        classes.push('datepicker-dateRange-item-active');
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