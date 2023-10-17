<template>
   <!-- Part 1: Header and Info -->
   
    <div class="container block">
        <div class="tile is-ancestor">
            <div class="tile is-9 is-parent is-vertical">
              <!-- Header -->
                        <article class="tile box custom-header">
                            <div class="tile is-6 is-child">
                              <div>
                                <h3 class="custom-margin">APP-TYPE :</h3><input type="text" placeholder="APP-TYPE" class="input is-small is-info custom-margin" value="EXP ILS Z APCH RWY 21"/>
                              </div>
                             <div class="tile is-parent padding-zero" >
                                <div >
                                  <h3 class="custom-margin">ATIS Report At :</h3><input type="text" placeholder="Time" class="input is-small custom-margin" value="1003Z"/>
                                  <h3 class="custom-margin">Vis :</h3><input type="text" placeholder="Visibility" class="input is-small custom-margin" value="10KM"/>
                                </div>
                                <div>
                                  <h3 class="custom-margin">MET Report At :</h3><input type="text" placeholder="Time" class="input is-small custom-margin" value="1000Z"/>
                                  <h3 class="custom-margin">Temp :</h3><input type="text" placeholder="Temperature" class="input is-small custom-margin" value="30C"/>
                                </div>
                            </div> 
                              <div>
                               
                              </div>
                            </div>
                            <div class="tile is-3 is-child">
                              <div>
                                <h3 class="custom-margin">RWY-IN-USE :</h3>
                                  <div>
                                    <select v-model="selectedRunway" class="select is-small custom-margin">
                                        <option v-for="runway in runwayOptions" :key="runway" :value="runway">
                                            {{ runway }}
                                        </option>
                                    </select>
                                    <button :class="getLeftButtonClass()">{{ getLeftButtonLabel() }}</button>
                                    <button :class="getRightButtonClass()">{{ getRightButtonLabel() }}</button>
                                  </div>
                                  
                              </div>
                              <div class="tile is-parent is-12 padding-zero">
                                <div>
                                  <h3 class="custom-margin">Wind :</h3><input type="text" placeholder="Wind" class="input is-small custom-margin" value="190/13KT"/>
                                  <h3 class="custom-margin">Dew Point :</h3><input type="text" placeholder="Wind" class="input is-small custom-margin" value="24C"/>
                                </div>                             
                                
                                
                              </div>
                            </div>
                            <div class="tile is-3 is-child">
                              <h3 class="custom-prevail-text">Prevailing Wx :</h3>
                                    <div class="prevail-wx-container ">
                                      <select class="select is-small custom-margin prevail-button">
                                          <option value="VMC">VMC</option>
                                          <option value="IMC">IMC</option>
                                      </select>
                                      <input type="text" placeholder="Prevailing Wx " class="input is-small prevail-input is-fullwidth custom-margin"/>
                                    </div>
                                    <div>
                                  <h3 class="custom-margin">RVR :</h3><input type="text" placeholder="Runway Visual Range" class="input is-small custom-margin"/>
                                  <h3 class="custom-margin">Wx :</h3><input type="text" placeholder="Weather" class="input is-small custom-margin"/>
                                </div>
                            </div>
                            
                                                            
                            
                        </article>
            </div>
        
          <!-- INFO -->
          <div class="tile is-parent is-vertical">
                <article class="tile box atis-info-box">
                    <h6 class="atis-info">{{ atisInfo }}</h6>
                </article>
          </div> 
        </div>          
    </div>
    <!-- QNH and mmHg -->
    <div class="container block">
      <div class="tile is-ancestor">
        
          <div class="tile is-parent is-6">
              <article class="tile box qnh-box">
                  <h6 class="qnh">{{ qnh }}</h6>
              </article> 
          </div>
          <div class="tile is-parent mmHg-box">
              <article class="tile box">
                  <h6 class="mmHg">{{ mmHg }}</h6>
              </article>
          </div>
        
      </div>
    </div>

    <!-- SUP and RMK -->
    <div class="container block">
      
        <article class="box">
          <input type="text" placeholder="SUP" class="input is-fullwidth"/>
          <br>
          <input type="text" placeholder="RMK" class="input is-fullwidth"/>
        </article>
      
    </div>
    <!-- Met Report -->
    <div class="container block">
      <div class="tile">
        <article class="tile box">
          <textarea class="textarea is-fullwidth" rows="2" placeholder="Met Report" v-model="localMetReportText"></textarea>
        </article>
      </div>
    </div>
 
</template>

<script>
export default {
  props: {
      error: String,
      atisInfo: String,
      atisRWY: String,
      atisWS: String,
      rcrContent: String,
      metReportText: String,
      qnh: String,
      mmHg: String   
  },
  data() {
  return {
    localMetReportText: "Met Report VTBD "+this.metReportText,
    runwayOptions: ['21', '21R', '21L', '03', '03L', '03R'],
    selectedRunway: '21'
  };
  },
  watch: {
        atisRWY: function(newValue) {
            // When atisRWY updates, change the dropdown's selected value
            this.selectedRunway = newValue;
        },
        selectedRunway: function(newValue) {
            // Emit an event or handle the change accordingly
            // Here, for demonstration, I'm logging the change.
            console.log('Selected runway changed:', newValue);
        }
    },
    mounted() {
        // Set initial value of dropdown from atisRWY prop
        this.selectedRunway = this.atisRWY;
    },
  methods: {
    getLeftButtonClass() {
        if (this.selectedRunway === '21' || this.selectedRunway === '21R') return 'button is-success is-small custom-margin';
        if (this.selectedRunway === '21L' || this.selectedRunway === '03R') return 'button is-danger is-small custom-margin';
        if (this.selectedRunway === '03' || this.selectedRunway === '03L') return 'button is-success is-small custom-margin';
        return 'button is-small custom-margin';
    },
    getRightButtonClass() {
        if (this.selectedRunway === '21' || this.selectedRunway === '21L') return 'button is-success is-small custom-margin';
        if (this.selectedRunway === '21R' || this.selectedRunway === '03L') return 'button is-danger is-small custom-margin';
        if (this.selectedRunway === '03' || this.selectedRunway === '03R') return 'button is-success is-small custom-margin';
        return 'button is-small custom-margin';
    },
    getLeftButtonLabel() {
        return this.selectedRunway.startsWith('21') ? '21R' : '03L';
    },
    getRightButtonLabel() {
        return this.selectedRunway.startsWith('21') ? '21L' : '03R';
    }
  }

}
</script>

  
  
  <style>
  html,body,template,header,footer,article{
  background-color: lightskyblue;
  }

  .padding-zero{
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  .custom-header {
    text-align: left;
  }

  .custom-margin {
    margin-right: 5px;
    margin-left: 5px;
}
.prevail-wx-container{
  display: flex;
  align-items: center;
  background-color: lightgrey;

  
}
.custom-prevail-text {
  /* adjust as needed */
  padding-left: 5px;
  background-color: lightgray;
  color: crimson;
 
}

.prevail-input {
   /* subtracting margin */
   width: calc(100% - 10px) !important;
}

.input
 {
  width: calc(100% - 10px) !important;
  
}
  /* Target the h6 with class 'atis-info' inside the box with class 'atis-info-box' */
  .atis-info-box .atis-info {
    width: 100%;
    font-size: 700%;
    font-weight: bold;
    display: block;
  }
  .qnh-box .qnh {
    width: 100%;
    font-size: 500%;
    font-weight: bold;
    display: block;
  }

  .mmHg-box .mmHg {
    width: 100%;
    font-size: 500%;
    font-weight: bold;
    display: block;
  }
  </style>
  