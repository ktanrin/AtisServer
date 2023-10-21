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
      parsedAppType: null,
      parsedAtisInfo: null,
      parsedAtisRWY: null,
      parsedAtisTime: null,
      parsedRCR: null,
      parsedMetReport: null,
      parsedWind: null,
      parsedVisibility: null,
      parsedTemperature: null,
      parsedDewPoint: null,
      parsedWeather: null,
      parsedMetReportTime: null,
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
          this.parsedAppType = this.parseAppType(response.data);
          this.parsedAtisInfo = this.parseAtisInfo(response.data);
          this.parsedAtisRWY = this.parseAtisRWY(response.data);
          this.parsedAtisTime = this.parseAtisTime(response.data);
          this.parsedMetReportTime = this.parseMetReportTime(response.data);
          this.parsedWindShear = this.parseWindShear(response.data);
          this.parsedRCR = this.parseRCR(response.data);
          this.parsedMetReport = this.parseMetReport(response.data);
          this.parsedWind = this.parseWind(response.data);
          this.parsedVisibility = this.parseVisibility(response.data);
          this.parsedTemperature = this.parseTemperature(response.data);
          this.parsedDewPoint = this.parseDewPoint(response.data);
          this.parsedWeather = this.parseWeather(response.data);
          this.parsedQNH = this.parseQNH(response.data);
          this.parsedmmHg = this.parsemmHg(response.data);

          // Emit the parsed data to the parent component
          this.$emit('atis-data-parsed', {
          appType: this.parsedAppType,
          atisInfo: this.parsedAtisInfo,
          atisRWY: this.parsedAtisRWY,
          atisTime: this.parsedAtisTime,
          metReportTime: this.parsedMetReportTime,
          atisWS: this.parsedWindShear,
          rcrContent: this.parsedRCR,
          metReportText: this.parsedMetReport,
          windInfo: this.parsedWind,
          visibility: this.parsedVisibility,
          temperature: this.parsedTemperature,
          dewPoint: this.parsedDewPoint,
          weather: this.parsedWeather,
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

    parseWeather(data) {
    // Match "VIS" followed by KM or M and capture everything until "CLD"
    const weatherRegex = /VIS (\d+KM|\d+M) ([A-Z\s]+) CLD/;
    
    const match = data.match(weatherRegex);

    if (match && match[2]) {
        const weather = match[2].trim();
        console.log(weather);
        return { weather };
    }
    return 'N/A';
    },

    parseAppType(data) {
    const lines = data.split('\n'); // Split the content into lines
    if (lines.length >= 6) {
      const appTypeLine = lines[5]; // Line 6 (zero-based index)

      // Skip the first word (time) and look for any approach type information, until a comma is reached
      const appTypeRegex = /\S+\s(.*?)\s*,/;
      const appTypeMatch = appTypeLine.match(appTypeRegex);

      if (appTypeMatch && appTypeMatch[1]) {
        return { appType: appTypeMatch[1] };
      } else {
        // If no comma is found, try matching any text after the time until the end of the line
        const alternativeRegex = /\S+\s(.*)/;
        const alternativeMatch = appTypeLine.match(alternativeRegex);
        if (alternativeMatch && alternativeMatch[1]) {
          return { appType: alternativeMatch[1] };
        }
      }
    }
    
    return { appType: 'N/A' }; // Return "N/A" if no approach type information was found
  },

    parseDewPoint(data) {
    // Split the content into words by spaces
    const words = data.split(/\s+/);

    for (const word of words) {
      //console.log('Examining word:', word);
      const dewPointRegex = /^DP(\d{1,2})$/; // Make sure we're matching the whole word
      const dewPointMatch = word.match(dewPointRegex);
      if (dewPointMatch && dewPointMatch[1]) {
        return { dewPoint: `${dewPointMatch[1]}C` };
      }
    }

    return { dewPoint: 'N/A' };  // return "N/A" if no dew point data was found
  },

    parseTemperature(data) {
    // Split the content into words by spaces
    const words = data.split(/\s+/);

    // Iterate over words and look for a match
    for (const word of words) {
      const temperatureRegex = /^T(\d{1,2})$/;  // Make sure we're matching the whole word
      const tempMatch = word.match(temperatureRegex);
      if (tempMatch && tempMatch[1]) {
        return { temperature: `${tempMatch[1]}C` };
      }
    }
    
    return { temperature: 'N/A' };  // return "N/A" if no temperature data was found
},


    parseVisibility(data) {
    // Split the content into words by spaces
    const words = data.split(/\s+/);

    // Find the index of "VIS" in the words array
    const visIndex = words.findIndex((word) => word === 'VIS');

    if (visIndex !== -1 && visIndex < words.length - 1) {
      // Extract the word following "VIS"
      const visibility = words[visIndex + 1];
      return { visibility };
    }
    
    return { error: 'Visibility not found' };
},

    parseWind(data) {
    // Split the content into words by spaces
    const words = data.split(/\s+/);

    // Find the index of "WIND" and "VIS" in the words array
    const windIndex = words.findIndex((word) => word === 'WIND');
    const visIndex = words.findIndex((word) => word === 'VIS');

    if (windIndex !== -1 && visIndex !== -1 && windIndex < visIndex) {
      // Extract the wind report between "WIND" and "VIS"
      const windReportWords = words.slice(windIndex + 1, visIndex);
      const windInfo = windReportWords.join(' ');
      return { windInfo };
    }

    return { error: 'Wind report not found' };
},

    parseMetReportTime(data) {
     // Split the content into words by spaces
    const words = data.trim().split(/\s+/);
    const windIndex = words.findIndex(word => word === 'WIND');

    if (windIndex !== -1 && windIndex > 0) {
      const metReportTime = words[windIndex - 1];
      if (/^\d{4}Z$/.test(metReportTime)) { // Check if it matches the MET report time format (e.g., 0055Z)
        return { metReportTime };
      }
    }

    return { error: 'MET report time not found' };
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
  //const trendIndex = words.findIndex((word) => word === 'TREND');
  //const endIndex = (adzIndex !== -1) ? adzIndex : trendIndex;

  //if (windIndex !== -1 && endIndex !== -1 && windIndex < endIndex)

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
