<template>
   <!-- Part 1: Header and Info -->
   <body>
    <div class="container block">
        <div class="tile is-ancestor">
            <div class="tile is-8 is-parent is-vertical">
              <!-- Header -->
                        <article class="tile box custom-header">
                            <div class="tile is-6 is-child">
                              <div>
                                <h3>APP-TYPE :</h3><input type="text" placeholder="APP-TYPE" class="input is-small is-info" value="EXP ILS Z APCH RWY 21"/>
                              </div>
                             <div class="tile is-parent" style="
                                  padding-top: 0px;
                                  padding-right: 0px;
                                  padding-bottom: 0px;
                                  padding-left: 0px;
                              "> 
                                <div >
                                  <h3>Met Report At :</h3><input type="text" placeholder="Time" class="input is-small" value="1000Z"/>
                                  <h3>Vis :</h3><input type="text" placeholder="Visibility" class="input is-small" value="10KM"/>
                                </div>
                                <div>
                                  <h3>ATIS Report At :</h3><input type="text" placeholder="Time" class="input is-small" value="1000Z"/>
                                  <h3>Temp :</h3><input type="text" placeholder="Temperature" class="input is-small" value="30C"/>
                                </div>
                            </div> 
                              <div>
                               
                              </div>
                            </div>
                            <div class="tile is-6 is-child">
                              <div>
                                <h3>RWY-IN-USE :</h3>
                                  <div>
                                    <select v-model="selectedRunway" class="select is-small custom-button">
                                        <option v-for="runway in runwayOptions" :key="runway" :value="runway">
                                            {{ runway }}
                                        </option>
                                    </select>
                                    <button :class="getLeftButtonClass()">{{ getLeftButtonLabel() }}</button>
                                    <button :class="getRightButtonClass()">{{ getRightButtonLabel() }}</button>
                                  </div>
                              </div>
                              <div class="tile is-parent" style="
                                  padding-top: 0px;
                                  padding-right: 0px;
                                  padding-bottom: 0px;
                                  padding-left: 0px;
                              ">
                                <div>
                                  <h3>Wind :</h3><input type="text" placeholder="Wind" class="input is-small" value="190/13KT"/>
                                  <h3>Dew Point :</h3><input type="text" placeholder="Wind" class="input is-small" value="24%"/>
                                </div>                             
                                <div>
                                  <h3>Prevailing Wx :</h3>
                                    <div>
                                      <select class="select is-small custom-button">
                                          <option value="VMC">VMC</option>
                                          <option value="IMC">IMC</option>
                                      </select>
                                    </div>
                                  <h3>Wx :</h3><input type="text" placeholder="Weather" class="input is-small"/>
                                </div>
                                
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
  </body>
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
        if (this.selectedRunway === '21' || this.selectedRunway === '21R') return 'button is-success is-small custom-button';
        if (this.selectedRunway === '21L' || this.selectedRunway === '03R') return 'button is-danger is-small custom-button';
        if (this.selectedRunway === '03' || this.selectedRunway === '03L') return 'button is-success is-small custom-button';
        return 'button is-small custom-button';
    },
    getRightButtonClass() {
        if (this.selectedRunway === '21' || this.selectedRunway === '21L') return 'button is-success is-small custom-button';
        if (this.selectedRunway === '21R' || this.selectedRunway === '03L') return 'button is-danger is-small custom-button';
        if (this.selectedRunway === '03' || this.selectedRunway === '03R') return 'button is-success is-small custom-button';
        return 'button is-small custom-button';
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
  html,body{
  background-color: lightskyblue;
  }

  .custom-header {
    text-align: left;
  }

  .custom-button {
    margin-right: 10px;
}

.input
 {
    width: calc(100% - 10px) !important;/* Reducing the width by 10px */
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
    font-size: 350%;
    font-weight: bold;
    display: block;
  }

  .mmHg-box .mmHg {
    width: 100%;
    font-size: 350%;
    font-weight: bold;
    display: block;
  }
  </style>
  