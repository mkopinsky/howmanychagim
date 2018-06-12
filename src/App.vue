<template>
  <div id="app">
    <div class="top">
      <h1>How many Chagim?</h1>
      <h3 class="year-selector">
        <a class="px-1 active">2018</a>
        <a class="px-1" href="#">2019</a>
        <a class="px-1" href="#">2020</a>
        <span>&ndash;</span>
        <a class="px-1" href="#">5778</a>
        <a class="px-1" href="#">5779</a>
        <a class="px-1" href="#">5780</a>
      </h3>
      <div class="container col-md-3 offset-md-9 fixed-top pt-3">
        <nav class="navbar navbar-dark bg-primary grand-totals">
          <h4 class="navbar-text">
            Total: <span class="badge badge-warning">12</span> work days, <span class="badge badge-secondary">5</span> weekends
          </h4>
        </nav>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-3 col-sm-6" v-for="holidays, month in holidays.holidaysByMonth">
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
    .year-selector .active {
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
