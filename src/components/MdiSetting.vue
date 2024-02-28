<template>
    <div>
      
      <div class="control-form buttons">
        <button class="button is-primary add-btn" @click="addMDI">Add</button>
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
      {{ console.log('mdilist length', mdilist.length) }}
      <table v-if="mdilist.length > 0" class="table is-fullwidth is-selected">
      <thead>
        <tr>
          <th>Sector</th>
          <th>Time</th>
          <th>Period</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(mdi, index) in mdilist" :key="index" @click="selectMDI(index)" :class="{ 'is-selected': selectedMDIIndex === index }">
          {{ console.log('mdi', mdi) }}
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
  //import { ipcRenderer } from 'electron';
  import MDIModal from './MDIModal.vue';
 
  const socket = io('http://localhost:1350');

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



  async mounted() {
    // Load MDI data at startup
    try {
    //console.log('window.electron',window.electron);
    const mdiData = await window.electron.loadMDIData();
    console.log('mdiData in mounted', mdiData);
    console.log('Type of mdiData in mounted', typeof mdiData, Array.isArray(mdiData));
      // Check if it's an array and has the correct structure
      if (Array.isArray(mdiData) && mdiData.every(item => 
      Object.prototype.hasOwnProperty.call(item, 'sector') && 
      Object.prototype.hasOwnProperty.call(item, 'time') && 
      Object.prototype.hasOwnProperty.call(item, 'period'))) {
        // If it's correct, set mdilist to the loaded data
        this.mdilist = mdiData;
        console.log('mdilist after assignment:', this.mdilist);
        this.$nextTick(() => {
        console.log('mdilist after DOM update:', this.mdilist);
        });
      } else {
      // If it's not, log an error and use an empty array
      console.error('MDI Data is not in expected format:', mdiData);
        this.mdilist = [];
    }
  } catch (error) {
    console.error('Failed to load MDI data:', error);
      this.mdilist = []; // Fallback to an empty array if there's an error
  }


    // Listen for MDI data updates from the server
    socket.on('updateMdiData', (mdiData) => {
    if (Array.isArray(mdiData)) {
    this.mdilist = mdiData;
    } else {
    //console.error('Expected mdiData to be an array, received:', mdiData);
    // Optionally initialize mdilist as an empty array if incorrect data type received
    console.log('Expected mdiData to be an array, received:', typeof mdiData, mdiData);
    }
    });
  },
  unmounted() {
    socket.off('updateMdiData');
  },

  watch: {
    mdilist: {
      handler: function (newVal, oldVal) {
        console.log('mdilist updated from', oldVal, 'to:', newVal);
      },
      deep: true
    }
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
    async saveMDI(mdiReceived) {
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
      //socket.emit('sendMdiFromSetting', this.mdilist);

      try {
        // Clone the object to ensure it's serializable
        const mdiDataToSave = JSON.parse(JSON.stringify(this.mdilist));
        await window.electron.saveMDIData(mdiDataToSave); // Save to file via IPC
        socket.emit('sendMdiFromSetting', this.mdilist); // Emit updated data to server
      } catch (error) {
        console.error('Error saving MDI data:', error);
  }
    },
    async removeMDI() {
      if (this.selectedMDIIndex > -1) {
        this.mdilist.splice(this.selectedMDIIndex, 1);
      } else {
        alert('Please select a row to remove.');
      }
      try {
        // Clone the object to ensure it's serializable
        const mdiDataToSave = JSON.parse(JSON.stringify(this.mdilist));
        await window.electron.saveMDIData(mdiDataToSave); // Save to file via IPC
        socket.emit('sendMdiFromSetting', this.mdilist); // Emit updated data to server
      } catch (error) {
        console.error('Error saving MDI data:', error);
  }
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
.add-btn{
  margin-left: 8px !important;
}
  </style>
  