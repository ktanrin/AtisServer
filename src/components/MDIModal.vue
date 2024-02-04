<template>
    <div class="modal" :class="{'is-active': isActive}">
      <div class="modal-background" @click="close"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">{{ modalTitle }}</p>
          <button class="delete" aria-label="close" @click="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="field is-grouped">
            <label class="label">Sector</label>
            <div class="control is-expanded">
              <input class="input" type="text" placeholder="Sector" v-model="mdi.sector" />
            </div>
          </div>
          <div class="field is-grouped">
            <label class="label">Time</label>
            <div class="control is-expanded">
              <input class="input" type="text" placeholder="Time" v-model="mdi.time" />
            </div>
          </div>
          <div class="field is-grouped">
            <label class="label">Period</label>
            <div class="control is-expanded">
              <input class="input" type="text" placeholder="Period" v-model="mdi.period" />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="save">Save</button>
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
        
        this.$emit('save-mdi', this.mdi);
        console.log('save mdiData', this.mdi);
        this.close();
      }
    },
    watch: {
    mdiData(newVal) {
      this.mdi = {...newVal}; // update the local copy when mdiData changes
      
    }
  }
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
  
  </style>
  