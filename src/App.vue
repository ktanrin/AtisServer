<template>
  <div>
    <AtisReader @atis-data-parsed="updateAtisData" />
    <AtisDisplay 
      :error="error"
      :appType="appType"
      :atisInfo="atisInfo"
      :atisRWY="atisRWY"
      :atisTime ="atisTime"
      :atisWS="atisWS"
      :metReportTime="metReportTime"
      :rcrContent="rcrContent"
      :metReportText="metReportText"
      :windInfo="windInfo"
      :visibility="visibility"
      :rvr="rvr"
      :temperature="temperature"
      :dewPoint="dewPoint"
      :weather="weather"
      :clouds="clouds"
      :qnh="qnh"
      :mmHg="mmHg"
    />
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import AtisReader from './components/AtisReader.vue'
import AtisDisplay from './components/AtisDisplay.vue';

export default {
  name: 'App',
  components: {
    AtisReader,
    AtisDisplay
  },
  data() {
    return {
      error: null,
      appType: null,
      atisInfo: null,
      atisRWY: null,
      atisTime: null,
      atisWS: null,
      metReportTime: null,
      rcrContent: null,
      metReportText: null,
      windInfo: null,
      visibility: null,
      rvr: null,
      temperature: null,
      weather: null,
      clouds: null,
      dewPoint: null,
      qnh: null,
      mmHg: null
    };
  },
  methods: {
    updateAtisData(data) {
      this.error = data.error;
      this.appType = data.appType?.appType || null;
      this.atisInfo = data.atisInfo?.atisInfo || null;
      this.atisRWY = data.atisRWY?.atisRWY || null;
      this.atisTime = data.atisTime?.atisTime || null;
      this.atisWS = data.atisWS?.atisWS || null;
      this.metReportTime = data.metReportTime?.metReportTime || null;
      this.rcrContent = data.rcrContent?.rcrContent || null;
      this.metReportText = data.metReportText?.metReportText || null;
      this.windInfo = data.windInfo?.windInfo || null;
      this.visibility = data.visibility?.visibility || null;
      this.rvr = data.rvr?.rvr || null;
      this.temperature = data.temperature?.temperature || null;
      this.dewPoint = data.dewPoint?.dewPoint || null;
      this.weather = data.weather?.weather || null;
      this.clouds = data.clouds?.clouds || null;
      this.qnh = data.qnh?.qnh || null;
      this.mmHg = data.mmHg?.mmHg || null;
      // console.log(data.qnh);
      // console.log(data.mmHg);
      // console.log(data.metReportText);
      // console.log(data.atisInfo);
      // console.log(data.atisRWY);
      // console.log(data.rcrContent);
      // console.log(data.atisTime);
      // console.log(data.metReportTime)
      // console.log(data.windInfo);
      // console.log(data.visibility);
      // console.log(data.temperature);
      // console.log(data.dewPoint);
      // console.log(data.appType);
      console.log(data.clouds);
      console.log(data.weather);
      console.log(data.rvr);
    }
  }
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
