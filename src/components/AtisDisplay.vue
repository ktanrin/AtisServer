<template>
  <div>
      <div>ATIS DISPLAY</div>
      <button>X</button>
      <div>
          <span>VTBD - ARR ATIS</span>
          <input type="text" v-model="atisCode" />
      </div>
      <div>
          <span>TIME</span>
          <input type="text" v-model="time" />
          <span>(MET at</span>
          <input type="text" v-model="metTime" />
          <span>)</span>
      </div>
      <div>APCH</div>
      <div>
          <span>RWY</span>
          <input type="text" v-model="rwy" />
          <input type="text" v-model="rwyLeft" />
          <input type="text" v-model="rwyRight" />
      </div>
      <!-- ... other input boxes ... -->
      <div>
          <span>Remark</span>
          <input type="text" v-model="remark" />
      </div>
  </div>
</template>

<script>
export default {
  data() {
      return {
          atisCode: 'Z',
          time: '0523z',
          metTime: '0430z',
          rwy: '21',
          rwyLeft: '21L',
          rwyRight: '21R',
          // ... other data properties ...
          remark: '(VTBD DEP ATIS 118.55 / ARR ATIS 126.4)'
      }
  }
}
</script>

  
  <script>
  export default {
    props: [
      'airportCode',
      'atisInfo',
      'time',
      'runway',
      'transitionLevel',
      'weatherTime',
      'wind',
      'visibility',
      'cloudAndWeather',
      'trend'
      // ... other fields as necessary
    ]
  };
  </script>
  
  <style scoped>
  /* You can add styling here to make the display visually appealing */
  h3 {
    text-decoration: underline;
  }
  
  div {
    margin-bottom: 10px;
  }
  </style>
  