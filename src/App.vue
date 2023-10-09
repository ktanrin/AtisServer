<template>
  <div>
    <AtisReader @atis-data-parsed="updateAtisData" />
    <AtisDisplay 
      :error="error"
      :atisInfo="atisInfo"
      :atisRWY="atisRWY"
      :rcrContent="rcrContent"
      :metReportText="metReportText"
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
      rcrContent: null,
      metReportText: null
    };
  },
  methods: {
    updateAtisData(data) {
      this.error = data.error;
      this.atisInfo = data.atisInfo?.atisInfo || null;
      this.atisRWY = data.atisRWY?.atisRWY || null;
      this.rcrContent = data.rcrContent?.rcrContent || null;
      this.metReportText = data.metReportText?.metReportText || null;
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
