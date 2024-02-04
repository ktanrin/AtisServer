<template>
    <div>
      
      <div class="control-form buttons">
        <button class="button is-primary" @click="addMDI">Add</button>
        <button class="button is-warning" :class="{ 'is-static': selectedMDIIndex === -1 }"
        @click="selectedMDIIndex !== -1 ? editMDI() : null">
        Edit
        </button>
        <button class="button is-danger" :class="{ 'is-static': selectedMDIIndex === -1 }"
        @click="selectedMDIIndex !== -1 ? removeMDI() : null"
        >Remove
      </button>
      </div>
      <!-- Your MDI settings form or UI elements go here -->
      <table class="table is-fullwidth is-selected">
      <thead>
        <tr>
          <th>Sector</th>
          <th>Time</th>
          <th>Period</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mdi, index) in mdilist" :key="index" @click="selectMDI(index)" :class="{ 'is-selected': selectedMDIIndex === index }">
          <td>{{ mdi.sector }}</td>
          <td>{{ mdi.time }}</td>
          <td>{{ mdi.period }}</td>
        </tr>
      </tbody>
    </table>

    <!-- MDI Modal Component -->
    <MDIModal
      :isActive="isModalActive"
      :mdiData="tempMDI"
      :modalTitle="modalTitle"
      @update:isActive="isModalActive = $event"
      @save-mdi="saveMDI"
    />

    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  import MDIModal from './MDIModal.vue';

  const socket = io('http://localhost:3000');

  export default {
    name: 'MdiSettings',
    components: {
      MDIModal
    },
    
    // Component logic here
    data() {
    return {
      mdilist: [],
      tempMDI: { sector: '', time: '', period: '' },
      selectedMDIIndex: -1,
      isModalActive: false,
      modalTitle: 'Add MDI'
    };
  },
  mounted() {
    socket.on('updateMdiData', (mdiData) => {
    if (Array.isArray(mdiData)) {
    this.mdilist = mdiData;
    } else {
    //console.error('Expected mdiData to be an array, received:', mdiData);
    // Optionally initialize mdilist as an empty array if incorrect data type received
    this.mdilist = [];
    }
    });
  },
  unmounted() {
    socket.off('updateMdiData');
  },
  methods: {
    addMDI() {
      this.tempMDI = { sector: '', time: '', period: '' }; // Reset the tempMDI for new entry
      this.modalTitle = 'Add MDI';
      this.isModalActive = true;
    },
    editMDI() {
      
      if (this.selectedMDIIndex > -1) {
        this.tempMDI = { ...this.mdilist[this.selectedMDIIndex] };
        this.modalTitle = 'Edit MDI';
        this.isModalActive = true;
        //this.$modal.show('mdi-modal');
      } else {
        alert('Please select a row to edit.');
      }
      
    },
    saveMDI(mdiReceived) {
      if (this.selectedMDIIndex === -1) {
        console.log('Type of mdilist before push:', typeof this.mdilist, Array.isArray(this.mdilist));
        this.mdilist.push(mdiReceived);
        console.log('save mdiData', mdiReceived);
      } else {
        this.mdilist.splice(this.selectedMDIIndex, 1, mdiReceived);
        this.selectedMDIIndex = -1; // Reset selected index
      }
      this.isModalActive = false; // Close the modal
      
      // Emit the updated MDI data back to the server
      socket.emit('sendMdiFromSetting', this.mdilist);
    },
    removeMDI() {
      if (this.selectedMDIIndex > -1) {
        this.mdilist.splice(this.selectedMDIIndex, 1);
      } else {
        alert('Please select a row to remove.');
      }
      // Emit the updated MDI data back to the server
      socket.emit('sendMdiFromSetting', this.mdilist);
    },
    selectMDI(index) {
      this.selectedMDIIndex = this.selectedMDIIndex === index ? -1 : index;
    }
  }
};
  </script>
  
  <style>
  /* Component-specific styles */
 th{
   text-align: center !important;
}
  </style>
  