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
      <div class="grand-totals mb-3">
        <h4>
          Total: <span class="badge badge-warning">12</span> work days, <span class="badge badge-secondary">5</span> weekends
        </h4>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="holidays, month in holidays.majorHolidays">
        <b-card
          header-tag="h5"
          :header="monthTotal(month)">
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
      return `${month} <span class="float-right"><span class="badge badge-warning">3</span> <span class="badge badge-secondary">1</span></span>`
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
