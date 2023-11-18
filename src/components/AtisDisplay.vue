<template>
  <!-- Part 1: Header and Info -->
  
   <div class="container block">
       <div class="tile is-ancestor">
           <div class="tile is-9 is-parent is-vertical">
             <!-- Header -->
                       <article class="tile box custom-header">
                           <div class="tile is-6 is-child">
                             <div>
                               <h3 class="custom-margin">APP-TYPE :</h3><input type="text" @input="updateAppType" placeholder="APP-TYPE" class="input is-small is-info custom-margin" :value="appType"/>
                             </div>
                            <div class="tile is-parent padding-zero" >
                               <div >
                                 <h3 class="custom-margin">ATIS Report At :</h3><input type="text" placeholder="Time" class="input is-small custom-margin" :value="atisTime" readonly/>
                                 <h3 class="custom-margin">Vis :</h3><input type="text" placeholder="Visibility" class="input is-small custom-margin" :value="visibility" readonly/>
                               </div>
                               <div>
                                 <h3 class="custom-margin">MET Report At :</h3><input type="text" placeholder="Time" class="input is-small custom-margin" :value="metReportTime" readonly/>
                                 <h3 class="custom-margin">Temp :</h3><input type="text" placeholder="Temperature" class="input is-small custom-margin" :value="temperature" readonly/>
                               </div>
                           </div> 
                             <div>
                              
                             </div>
                           </div>
                           <div class="tile is-3 is-child">
                             <div>
                               <h3 class="custom-margin">RWY-IN-USE :</h3>
                                 <div>
                                   <select v-model="selectedRunway" @change="sendData" class="select is-small custom-margin">
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
                                 <h3 class="custom-margin">Wind :</h3><input type="text" placeholder="Wind" class="input is-small custom-margin" :value="windInfo" readonly/>
                                 <h3 class="custom-margin">Dew Point :</h3><input type="text" placeholder="Wind" class="input is-small custom-margin" :value="dewPoint" readonly/>
                               </div>                             
                               
                               
                             </div>
                           </div>
                           <div class="tile is-3 is-child">
                             <h3 class="custom-prevail-text">Prevailing Wx :</h3>
                                   <div class="prevail-wx-container ">
                                     <select class="select is-small custom-margin prevail-button" v-model="localData.prevailWx" @change="sendData">
                                         <option value="VMC">VMC</option>
                                         <option value="IMC">IMC</option>
                                     </select>
                                     <input type="text" placeholder="Prevailing Wx " class="input is-small prevail-input is-fullwidth custom-margin"/>
                                   </div>
                                   <div>
                                 <h3 class="custom-margin">RVR :</h3><input type="text" :placeholder="rvr === 'N/A' || !rvr ? 'Runway Visual Range' : ''" 
                                                                     class="input is-small custom-margin" :value="rvr !== 'N/A' ? rvr : ''"  readonly/>
                                 <h3 class="custom-margin">Wx :</h3><input type="text" :placeholder="weather === 'N/A' || !weather ? 'Weather' : ''" 
                                                                     class="input is-small custom-margin" :value="weather !== 'N/A' ? weather : ''" readonly/>
                               </div>
                           </div>
                           
                                                           
                           
                       </article>
           </div>
       
         <!-- INFO -->
         <div class="tile is-parent is-vertical">
               <article class="tile box atis-info-box" :class="{ 'flash-orange': flashInfo }">
                   <h6 class="atis-info" >{{ atisInfo }}</h6>
               </article>
         </div> 
       </div>          
   </div>
   <!-- QNH and mmHg -->
   <div class="container block">
     <div class="tile is-ancestor">
       
         <div class="tile is-parent is-6">
             <article class="tile box qnh-box" :class="{ 'flash-orange': flashQNH }">
                 <h6 class="qnh">{{ qnh }}</h6>
             </article> 
         </div>
         <div class="tile is-parent mmHg-box">
             <article class="tile box" :class="{ 'flash-orange': flashmmHg }">
                 <h6 class="mmHg">{{ mmHg }}</h6>
             </article>
         </div>
       
     </div>
   </div>

   <!-- SUP and RMK -->
   <div class="container block">
     
       <article class="box">
         <input type="text" v-model="supValue" @input="sendData" placeholder="SUP" class="input is-fullwidth"/>
         <br>
         <input type="text"  v-model="rmkValue" @input="sendData" placeholder="RMK" class="input is-fullwidth"/>
       </article>
     
   </div>
   <!-- Met Report -->
   <div class="container block">
     <div class="tile">
       <article class="tile box">
         <textarea class="textarea is-fullwidth"  @input="sendData" rows="2" placeholder="Met Report" v-model="localMetReportText" readonly></textarea>
       </article>
     </div>
   </div>

</template>

<script>

import { reactive, toRefs, ref, watch } from 'vue';
import io from 'socket.io-client';

export default {
 props: {
     error: String,
     appType: String,
     atisInfo: String,
     atisRWY: String,
     atisTime: String,
     metReportTime: String,
     atisWS: String,
     rcrContent: String,
     metReportText: String,
     windInfo: String,
     visibility: String,
     rvr: String,
     temperature: String,
     dewPoint: String,
     weather: String,
     clouds: String,
     qnh: String,
     mmHg: String,
     sup: String   
 },
 setup(props) {
       const socket = io('http://localhost:3000');

       const localData = reactive({
         appType: props.appType,
         prevailWx: 'VMC',
       });

       const updateAppType = (event) => {
         localData.appType = event.target.value;
         sendData();
       };
       
       // This makes props reactive and usable inside setup
       const reactiveProps = toRefs(props);

       const selectedRunway = ref('21'); 

       const supValue = ref(props.sup);
       console.log('sup value:', supValue);
       const rmkValue = ref('');

       watch(reactiveProps.sup, (newVal) => {
        supValue.value = newVal;
        });

       watch(reactiveProps.atisInfo, () => {
       sendData();
       });

       const sendData = () => {
           if (!reactiveProps) {
             console.error('Props are not defined');
             return;
         }
       const dataToSend = {
       error: reactiveProps.error.value,
       appType: localData.appType,
       prevailWx: localData.prevailWx,
       atisInfo: reactiveProps.atisInfo.value,
       atisRWY: selectedRunway.value,
       atisTime: reactiveProps.atisTime.value,
       metReportTime: reactiveProps.metReportTime.value,
       atisWS: reactiveProps.atisWS.value,
       rcrContent: reactiveProps.rcrContent.value,
       windInfo: reactiveProps.windInfo.value,
       visibility: reactiveProps.visibility.value,
       rvr: reactiveProps.rvr.value,
       temperature: reactiveProps.temperature.value,
       dewPoint: reactiveProps.dewPoint.value,
       weather: reactiveProps.weather.value,
       clouds: reactiveProps.clouds.value,
       qnh: reactiveProps.qnh.value,
       mmHg: reactiveProps.mmHg.value,
       sup: supValue.value,
       rmk: rmkValue.value
       
       // ... include all other props here ...
     };
     console.log('Sending data:', dataToSend);  // Log data for debugging
     //console.log(`Emitting event: ${send-data}`);
     socket.emit('sendDataFromDisplay', dataToSend);
   };
     
         return {
           localData,
           updateAppType,  
           sendData,
           supValue,
           rmkValue,
           selectedRunway
         };
   },
 data() {
 return {
   flashInfo: false,
   flashQNH: false,
   flashmmHg: false,
   runwayOptions: ['21', '21R', '21L', '03', '03L', '03R'],
   
 };
 },
 computed: {
 localMetReportText() {
   return "Met Report VTBD " + this.metReportText;
 }
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
       },
       localMetReportText: function(newValue) {
         // Emit an event or handle the change accordingly
         // Here, for demonstration, I'm logging the change.
         console.log('Met Report changed:', newValue);
       },
       'atisInfo'(newVal, oldVal) {
      if (newVal !== oldVal) {
      this.flashInfo = true;
      setTimeout(() => this.flashInfo = false, 10000); // Reset after 2 seconds
      }
        },
        'qnh'(newVal, oldVal) {
      if (newVal !== oldVal) {
      this.flashQNH = true;
      setTimeout(() => this.flashQNH = false, 10000); // Reset after 2 seconds
      }
        },
        'mmHg'(newVal, oldVal) {
      if (newVal !== oldVal) {
      this.flashmmHg = true;
      setTimeout(() => this.flashmmHg = false, 10000); // Reset after 2 seconds
      }
        },
   },
   mounted() {
     console.log('atisTime value:', this.atisTime);
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
       return this.selectedRunway && this.selectedRunway.startsWith('21') ? '21R' : '03L';
   },
   getRightButtonLabel() {
       return this.selectedRunway && this.selectedRunway.startsWith('21') ? '21L' : '03R';
   }

 }

}
</script>

  
  
  <style>
  html,body,header,footer{
  background-color: lightskyblue !important;
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

  @keyframes flash-orange {
  0%, 100% { background-color: white; }
  50% { background-color: orange; }
  }

  .flash-orange {
  animation: flash-orange 1s 10; /* Run for 1 second and repeat twice */
  }
  </style>
  