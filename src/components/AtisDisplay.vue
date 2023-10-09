<template>
  
  <section class="section">
    <div class="container">
        <div class="tile is-ancestor">
            <div class="tile is-vertical is-8">
                <div class="tile">
                    <div class="tile is-parent">
                        <article class="tile is-child notification">
                            <!-- Your ATIS DISPLAY content here -->
                            <div>
                              <div v-if="atisInfo">
                                <h3>ATIS Information : {{ atisInfo }}</h3>
                              </div>
                              <div v-if="atisRWY">
                                <h3>ATIS RWY : {{ atisRWY }}</h3>
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
                </div>
                <div class="tile is-parent">
                    <article class="tile is-child notification">
                        <!-- Your MET REPORT and other details here -->
                        <div v-if="metReportText">
                          <h3>MET Report : {{ metReportText }}</h3>
                        </div>
                    </article>
                </div>
            </div>
            <div class="tile is-parent">
                <article class="tile is-child notification">
                    <!-- Your large number display here -->
                    <p class="title">1021</p>
                </article>
            </div>
        </div>
    </div>
</section>
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
  