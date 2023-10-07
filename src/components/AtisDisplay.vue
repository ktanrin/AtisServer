<template>
    <div>
      <h3>ATIS Information</h3>
      <div v-if="airportCode">
        <strong>Airport Code:</strong> {{ airportCode }}
      </div>
      <div v-if="atisInfo">
        <strong>ATIS Info:</strong> {{ atisInfo }}
      </div>
      <div v-if="time">
        <strong>Time:</strong> {{ time }}
      </div>
      <div v-if="runway">
        <strong>Runway:</strong> RWY-IN-USE {{ runway }}
      </div>
      <div v-if="transitionLevel">
        <strong>Transition Level:</strong> FL{{ transitionLevel }}
      </div>
      <div v-if="weatherTime">
        <strong>Weather Time:</strong> {{ weatherTime }}
      </div>
      <div v-if="wind">
        <strong>Wind:</strong> {{ wind }}
      </div>
      <div v-if="visibility">
        <strong>Visibility:</strong> {{ visibility }}
      </div>
      <div v-if="cloudAndWeather">
        <strong>Clouds & Weather:</strong> {{ cloudAndWeather }}
      </div>
      <div v-if="trend">
        <strong>Trend:</strong> {{ trend }}
      </div>
      <!-- Add any other fields as necessary -->
    </div>
  </template>
  
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
  