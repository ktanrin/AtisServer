<template>
    <div class="modal" :class="{'is-active': isActive}">
      <div class="modal-background" @click="close"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ modalTitle }}</p>
          <button class="delete" aria-label="close" @click="close"></button>
        </header>
        <section class="modal-card-body">
        <!-- Sector Field -->
        <div class="field is-grouped">
          <label class="label">Sector</label>
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="Sector" v-model="mdi.sector" />
            <p class="help is-danger" v-if="!isSectorValid">
              Sector is required
            </p>
          </div>
        </div>
        
        <!-- Time Field -->
        <div class="field is-grouped">
          <label class="label">Time</label>
          <div class="control is-expanded">
            <input class="input" type="number" placeholder="Time" v-model="mdi.time" />
            <p class="help is-danger" v-if="!isTimeValid">
              Time is required
            </p>
          </div>
        </div>
        
        <!-- Period Field -->
        <div class="field is-grouped">
          <label class="label">Period</label>
          <div class="control is-expanded">
            <input class="input" type="text" placeholder="Period" v-model="mdi.period" />
            <p class="help is-danger" v-if="!isPeriodValid">
              Period format must be hhmm-hhmm, e.g., 1200-1300.
            </p>
          </div>
        </div>
      </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="save" >Save</button>
          <button class="button" @click="close">Cancel</button>
        </footer>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isActive: Boolean,
      mdiData: {
        type: Object,
        default: () => ({ sector: '', time: '', period: '' })
      },
      modalTitle: String
    },
    data() {
      return {
        mdi: {...this.mdiData} // create a local copy of mdiData
      }
    },
    emits: ['update:isActive', 'save-mdi'],
    methods: {
      close() {
        this.$emit('update:isActive', false);
      },
      save() {
        if (!this.isFormValid) {
        // Optionally, inform the user that the form is invalid
        alert("Please fill in all fields correctly.");
        return;
        }
        this.$emit('save-mdi', this.mdi);
        console.log('save mdiData', this.mdi);
        this.close();
      }
    },
    watch: {
    mdiData(newVal) {
      this.mdi = {...newVal}; // update the local copy when mdiData changes
    }
  },
    computed: {
    isSectorValid() {
      return this.mdi.sector.trim().length > 0;
    },
    isTimeValid() {
      return !!this.mdi.time; // Ensuring time is not empty or zero
    },
    isPeriodValid() {
      const regex = /^\d{4}-\d{4}$/; // Format: hhmm-hhmm
      return regex.test(this.mdi.period);
    },
    isFormValid() {
      return this.isSectorValid && this.isTimeValid && this.isPeriodValid;
    },
  },


  };
  </script>
  <style>
  
  
  .modal-card-title {
    justify-content: space-between;
    text-align: left;
  }
  label{
    width: 100px;
  }
  p.help.is-danger {
    padding-left: 0.5em;
    text-align: left;
  }
  .modal-card-foot, .modal-card-head {
    padding-top: 0.5em !important;
    padding-bottom: 0.5em !important;
  }
  .modal-card{
    width: 480px !important;
  }
  </style>
  