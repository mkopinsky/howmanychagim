<template>
  <div id="app">
    <div class="top">
      <h1>How many Chagim?</h1>
      <h3 class="year-selector">
        <span class="active">2018</span>
        <a href="#">2019</a>
        <a href="#">2020</a>
        <span>&ndash;</span>
        <a href="#">5778</a>
        <a href="#">5779</a>
        <a href="#">5780</a>
      </h3>
    </div>
    <div class="row">
      <div class="col-sm-4 d-none">
        <div class="card">
          <h5 class="card-header">
            Pesach
          </h5>
          <div class="card-body">
            <h5 class="card-title">March 31st - April 7, 2018</h5>
            <ul class="days">
              <li class="yt"><label><input type="checkbox" id="pesach1" disabled checked /> Sat March 31, 2018</label></li>
              <li class="yt"><label><input type="checkbox" id="pesach2" disabled checked /> Sun April 1, 2018</label></li>
              <li><label><input type="checkbox" id="pes_chm1"/> Mon April 2, 2018</label></li>
              <li><label><input type="checkbox" id="pes_chm2"/> Tue April 3, 2018</label></li>
              <li><label><input type="checkbox" id="pes_chm3"/> Wed April 4, 2018</label></li>
              <li><label><input type="checkbox" id="pes_chm4"/> Thur April 5, 2018</label></li>
              <li class="yt"><label><input type="checkbox" id="pesach7" checked/> Fri April 6, 2018</label></li>
              <li class="yt"><label><input type="checkbox" id="pesach8" disabled checked /> Sat April 7, 2018</label></li>
            </ul>
          </div>
          <div class="card-footer">
            Selected: <span class="total">1</span> weekday, <span class="total">1</span> weekend
          </div>
        </div>
      </div>

      <div class="col-md-3 col-sm-6" v-for="holidays, month in holidays.majorHolidays">
        <b-card
          :header="month"
          header-tag="h5"
          :footer="monthTotal(month)">
          <ul class="days">
            <li v-for="holiday in holidays" :class="{yt: holiday.yomtov}">
              <label>
                <input type="checkbox" :checked="holiday.yomtov" />
                {{ format(holiday.date) }} 
                (<a :href="holiday.link" :title="JSON.stringify(holiday)" target="_blank">{{holiday.title}}</a>)
              </label>
            </li>
          </ul>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>

import holidays from './holidays';
import format from 'date-fns/format';

export default {
  name: 'app',
  data () {
    return {
      holidays
    }
  },
  methods: {
    format(date) {
      return format(date, 'ddd MMM Do')
    },
    monthTotal(month) {
      return `Total: <span class="total">1</span> weekday, <span class="total">1</span> weekend`
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
    .year-selector span.active {
      text-decoration: underline dotted;
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
