<template>
  <div>
    <AtisReader @atis-data-parsed="updateAtisData" />
    <AtisDisplay 
      :error="error"
      :atisInfo="atisInfo"
      :atisRWY="atisRWY"
      :rcrContent="rcrContent"
      :metReportText="metReportText"
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
      atisInfo: null,
      atisRWY: null,
      atisTime: null,
      rcrContent: null,
      metReportText: null,
      qnh: null,
      mmHg: null
    };
  },
  methods: {
    updateAtisData(data) {
      this.error = data.error;
      this.atisInfo = data.atisInfo?.atisInfo || null;
      this.atisRWY = data.atisRWY?.atisRWY || null;
      this.atisTime = data.atisTime?.atisTime || null;
      this.rcrContent = data.rcrContent?.rcrContent || null;
      this.metReportText = data.metReportText?.metReportText || null;
      this.qnh = data.qnh?.qnh || null;
      this.mmHg = data.mmHg?.mmHg || null;
      console.log(data.qnh);
      console.log(data.mmHg);
      console.log(data.metReportText);
      console.log(data.atisInfo);
      console.log(data.atisRWY);
      console.log(data.rcrContent);
      console.log(data.atisTime);
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
