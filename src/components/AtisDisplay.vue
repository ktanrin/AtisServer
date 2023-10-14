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
                                <h3>APP-TYPE :</h3><input type="text" placeholder="APP-TYPE" class="input is-small" value="EXP ILS Z APCH RWY 21"/>
                              </div>
                              <div>
                                <h3>Met Report At :</h3><input type="text" placeholder="Time" class="input is-small" value="1000"/>
                              </div>
                              <div>
                                <h3>Vis :</h3><input type="text" placeholder="Visibility" class="input is-small" value="10KM"/>
                              </div>
                            </div>
                            <div class="tile is-child">
                              <div>
                                <h3>ATIS RWY : {{ atisRWY }}</h3>
                                  <div>
                                    <button class = "button is-success is-small custom-button">21R</button>
                                    <button class = "button is-success is-small custom-button">21L</button>
                                  </div>
                              </div>
                              <div>
                                <h3>Wind :</h3><input type="text" placeholder="Wind" class="input is-small" value="190/13KT"/>
                              </div>                             
                              <div>
                                <h3>Wx :</h3><input type="text" placeholder="Weather" class="input is-small" value="VMC"/>
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
    localMetReportText: "Met Report VTBD "+this.metReportText 
  };
  },
  methods: {
    check() {
      console.log('qnh:', this.qnh);
      console.log('mmHg:', this.mmHg);
      console.log('metReportText:', this.metReportText);
      console.log('localMetReportText:', this.localMetReportText);
      console.log('atisInfo:', this.atisInfo);
      console.log('atisRWY:', this.atisRWY);
      console.log('atisWS:', this.atisWS);
    }
  },
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
  