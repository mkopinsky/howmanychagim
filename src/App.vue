<template>
  <div id="app">
    <div class="top">
      <!-- <img src="./assets/logo.png"> -->
      <h1>How many Chagim?</h1>
      <h2>2018</h2>
    </div>
    <div class="row">
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">
            Pesach
          </div>
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
            <p class="card-text">Total PTO days: <span class="total">1</span></p>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">
            Pesach
          </div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">
            Pesach
          </div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">
            Pesach
          </div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">
            Pesach
          </div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
      <div class="col-sm-3">
        <div class="card">
          <div class="card-header">
            Pesach
          </div>
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
