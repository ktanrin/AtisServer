<template>
   <div></div>
</template>

<script>

export default {
 
  data() {
    return {
      fileContent: null,
      error: null,
      selectedFilePath: '',
      parsedAtisInfo: null,
      parsedAtisRWY: null,
      parsedAtisTime: null,
      parsedRCR: null,
      parsedMetReport: null,
      parsedQNHqnh: null,
      parsedmmHg: null,
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
          this.parsedAtisTime = this.parseAtisTime(response.data);
          this.parsedWindShear = this.parseWindShear(response.data);
          this.parsedRCR = this.parseRCR(response.data);
          this.parsedMetReport = this.parseMetReport(response.data);
          this.parsedQNH = this.parseQNH(response.data);
          this.parsedmmHg = this.parsemmHg(response.data);

          // Emit the parsed data to the parent component
          this.$emit('atis-data-parsed', {
          atisInfo: this.parsedAtisInfo,
          atisRWY: this.parsedAtisRWY,
          atisTime: this.parsedAtisTime,
          atisWS: this.parsedWindShear,
          rcrContent: this.parsedRCR,
          metReportText: this.parsedMetReport,
          qnh: this.parsedQNH,
          mmHg: this.parsedmmHg
          });

        } else {
          this.error = response.error;
        }
      } catch (err) {
        console.error("Error reading file:", err);
        this.error = "Failed to read the file.";
      }

      

    },

    parseAtisTime(data) {
    const lines = data.split('\n'); // Split the content into lines
    if (lines.length >= 6) {
      const atisTimeLine = lines[5]; // Line 6 (zero-based index)
      const words = atisTimeLine.trim().split(/\s+/); // Split the line into words
      const atisTime = words[0]; // Extract the first word
      if (/^\d{4}Z$/.test(atisTime)) { // Check if it matches the ATIS time format (e.g., 0055Z)
        return { atisTime };
      }
    }
    return { error: 'Invalid content format' };
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
  },

parseQNH(data) {
 
  // Extract QNH from the data
  const qnhRegex = /QNH (\d+)HPA/;
    const qnhMatch = data.match(qnhRegex);
    if (qnhMatch && qnhMatch[1]) {
        console.log(qnhMatch[1]);
        return { qnh: qnhMatch[1] }; // calculate and store the mmHg value
    }
    return { error: 'N/A' };
},

parsemmHg(data) {
 
  // Extract QNH from the data
  const qnhRegex = /QNH (\d+)HPA/;
    const qnhMatch = data.match(qnhRegex);
    if (qnhMatch && qnhMatch[1]) {
        return { mmHg: String(Math.floor(qnhMatch[1] * 0.0295301 * 100)) }; // calculate and store the mmHg value
    }
    return { error: 'N/A' };
}
    
  }
};
</script>

<style scoped>
/* Your styling here */
</style>
