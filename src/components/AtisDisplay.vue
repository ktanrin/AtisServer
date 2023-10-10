<template>
    <div class="container">
        <div class="tile">
            <div class="tile is-8">
                        <article class="tile is-parent">
                            <!-- Your ATIS DISPLAY content here -->
                            <div>
                              <div v-if="atisInfo">
                                <h3>APP-TYPE : EXP ILS Z APCH RWY 21</h3>
                              </div>
                              <div v-if="atisRWY">
                                <h3>ATIS RWY : {{ atisRWY }}</h3>
                                <button class = "button is-success">21R</button> 
                                <button class = "button is-success">21L</button>
                              </div>
                              <div v-if="atisWS">
                              <h3>ATIS WS : {{ atisWS }}</h3>
                              </div>
                              <div v-if="rcrContent">
                                <h3>RCR Content : {{ rcrContent }}</h3>
                              </div>      
                            </div>
                        </article>
            </div>
            <div class="tile is-vertical">
                <article class="tile box">
                    <!-- Your large number display here -->
                    <h6 class="is-width">{{ atisInfo }}</h6>
                </article>
              </div>           
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
      metReportText: String      
  }
}
</script>

  
  
  <style>
  /* You can add styling here to make the display visually appealing */
 
  </style>
  