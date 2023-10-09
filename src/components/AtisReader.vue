<template>
   <AtisDisplay 
      :error="error"
      :atisInfo="parsedAtisInfo?.atisInfo"
      :atisRWY="parsedAtisRWY?.atisRWY"
      :atisWS="parsedWindShear?.atisWS"
      :rcrContent="parsedRCR?.rcrContent"
      :metReportText="parsedMetReport?.metReportText"
    />
</template>

<script>
import AtisDisplay from './AtisDisplay.vue'; // adjust the path if necessary
export default {
  components: {
    AtisDisplay
  },
  data() {
    return {
      AtisDisplay,
      fileContent: null,
      error: null,
      selectedFilePath: '',
      parsedAtisInfo: null,
      parsedAtisRWY: null,
      parsedRCR: null,
      parsedMetReport: null,
      parsedWindShear: null
    };
  },
  mounted() {
    // Listen for the 'selected-file-path' event from the main process
    window.electron.on('selected-file-path', (filePath) => {
      console.log('Event received in component:', filePath);
      this.selectedFilePath = filePath;
      this.readFileContent();
    });
    // Trigger the event to select the latest file
    this.selectLatestFile();
  },
  beforeUnmount() {
    window.electron.removeAllListeners('selected-file-path');
  },
  methods: {
    selectLatestFile() {
      console.log('Requesting latest file path...');
      window.electron.send('set-folder-path', false);
    },
    async readFileContent() {
      console.log('Attempting to read file:', this.selectedFilePath);
      if (!this.selectedFilePath) {
        console.warn("Selected file path is not set.");
        this.error = "Selected file path is not set.";
        return;
      }
      try {
        const response = await window.electron.invoke('read-file', this.selectedFilePath);
        console.log('Response from reading file:', response);
        if (response.success) {
          this.fileContent = response.data;
          // Parse ATIS info and store it
          this.parsedAtisInfo = this.parseAtisInfo(response.data);
          this.parsedAtisRWY = this.parseAtisRWY(response.data);
          this.parsedWindShear = this.parseWindShear(response.data);
          this.parsedRCR = this.parseRCR(response.data);
          this.parsedMetReport = this.parseMetReport(response.data);
        } else {
          this.error = response.error;
        }
      } catch (err) {
        console.error("Error reading file:", err);
        this.error = "Failed to read the file.";
      }

      

    },

    parseAtisInfo(data) {
        const lines = data.split('\n'); // Split the content into lines
      if (lines.length >= 5) {
        const atisInfoLine = lines[4]; // Line 5 (zero-based index)
        const words = atisInfoLine.trim().split(/\s+/); // Split the line into words
        const infoIndex = words.findIndex(word => word.toUpperCase() === 'INFO'); // Find the index of "INFO"

    if (infoIndex !== -1 && infoIndex < words.length - 1) {
      // Extract the word following "INFO"
      const atisInfo = words[infoIndex + 1];
      return { atisInfo };
    }
      return { atisInfo: 'N/A' };
      } else {
        return { error: 'Invalid content format' };
      }
    },

    parseAtisRWY(data){
      const lines = data.split('\n'); // Split the content into lines
      if (lines.length >= 6) {
        const atisRWYLine = lines[5]; // Line 6 (zero-based index)
        console.log(atisRWYLine);
        const words = atisRWYLine.trim().split(/\s+/); // Split the line into words
        const USEIndex = words.findIndex(word => word.toUpperCase() === 'USE' || word.toUpperCase() === 'RWY-IN-USE' ); // Find the index of "USE"

    if (USEIndex !== -1 && USEIndex < words.length - 1) {
      // Extract the word following "USE"
      const atisRWY = words[USEIndex + 1];
      return { atisRWY };
    }
      return { atisRWY: 'N/A' };
      } else {
        return { error: 'Invalid content format' };
      }

    },

    parseRCR(data) {
  const lines = data.split('\n'); // Split the content into lines
  const rcrLines = [];

  // Check each line for 8 '/' characters
  lines.forEach((line) => {
    if (line.trim().split('/').length === 9) {
      rcrLines.push(line);
      console.log(line);
    }
  });

  // Join the matching lines back together to form the RCR content
  const rcrContent = rcrLines.join('\n');
  console
  if (rcrContent) {
    return { rcrContent };
  } else {
    return { error: 'RCR data not found' };
  }
},

parseMetReport(data) {
  // Split the content into words by spaces
  const words = data.split(/\s+/);

  // Find the index of "WIND" and "ADZ" in the words array
  const windIndex = words.findIndex((word) => word === 'WIND');
  const adzIndex = words.findIndex((word) => word === 'ADZ');

  if (windIndex !== -1 && adzIndex !== -1 && windIndex < adzIndex) {
    // Extract the MET report between "WIND" and "ADZ"
    const metReportWords = words.slice(windIndex - 1, adzIndex);
    const metReportText = metReportWords.join(' ');
    console.log(metReportText);
    return { metReportText };
  }

  return { error: 'MET report not found' };
},

parseWindShear(data) {
    const targetWords = ['WS', 'MBST', 'REP', 'OBS', 'FCST'];
    const lines = data.split('\n'); 
    const wsLines = lines.filter(line => {
      return targetWords.some(word => line.includes(word));
    });
    return { atisWS: wsLines.join('\n') };
  }
    
  }
};
</script>

<style scoped>
/* Your styling here */
</style>
