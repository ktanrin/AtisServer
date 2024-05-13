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
      parsedRVR: null,
      parsedTemperature: null,
      parsedDewPoint: null,
      parsedWeather: null,
      parsedClouds: null,
      parsedMetReportTime: null,
      parsedQNHqnh: null,
      parsedmmHg: null,
      parsedWindShear: null,
      parsedSupplementary: null
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
          this.parsedRVR = this.parseRVR(response.data);
          this.parsedTemperature = this.parseTemperature(response.data);
          this.parsedDewPoint = this.parseDewPoint(response.data);
          this.parsedWeather = this.parseWeather(response.data);
          this.parsedClouds = this.parseClouds(response.data);
          this.parsedQNH = this.parseQNH(response.data);
          this.parsedmmHg = this.parsemmHg(response.data);
          this.parsedSupplementary = this.parseSupplementary(response.data);

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
          rvr: this.parsedRVR,
          temperature: this.parsedTemperature,
          dewPoint: this.parsedDewPoint,
          weather: this.parsedWeather,
          clouds: this.parsedClouds,
          qnh: this.parsedQNH,
          mmHg: this.parsedmmHg,
          sup: this.parsedSupplementary
          });

        } else {
          this.error = response.error;
        }
      } catch (err) {
        console.error("Error reading file:", err);
        this.error = "Failed to read the file.";
      }

      

    },
    parseSupplementary(data) {
     // Regular expression to capture text between the last "HPA" and "TREND"
      const supplementaryRegex =  /QNH\s+\d+HPA\s+(?:QFE\s+\d+HPA\s+)?([\s\S]*?)\s*TREND/;

      // Search for the pattern in the data
      const match = data.match(supplementaryRegex);

      if (match && match[1]) {
        // If a match is found, return the captured supplementary information
        const sup = match[1].trim();
        console.log(sup);
        return { sup };
      }

      return { error: 'Supplementary data not found' };
  },

    parseClouds(data) {
    // Regular expression to match cloud data between "CLD" and "T" followed by digits
    const cloudRegex = /CLD (.*?) T\d+/;

    const match = data.match(cloudRegex);
    if (match && match[1]) {
      // Found cloud data, return it
      
      return { clouds: match[1].trim() };
    }

    // If no match, return a default or error message
    return { clouds: 'N/A' };
  },

    parseRVR(data) {

      const rvrRegex = /RVR RWY (\d{2}[RL]?) ((?:TDZ|MID|END)? ?(?:BLW|ABV)? ?\d{1,4}M?)(?: ((?:TDZ|MID|END)? ?(?:BLW|ABV)? ?\d{1,4}M?))?((?: ((?:TDZ|MID|END)? ?(?:BLW|ABV)? ?\d{1,4}M?))?)?/g;

      let match;
      const rvrValues = [];
      const lines = data.split('\n');

      for (let line of lines) {
        let lineRVRs = [];
        while ((match = rvrRegex.exec(line)) !== null) {
            const runway = match[1];
            const segments = [];

            for (let i = 2; i <= 5; i++) {
                if (match[i]) {
                    const segmentData = match[i].trim();
                    segments.push(segmentData);
                }
            }

          const parsedSegments = segments.map(segment => {
              return segment;
          });

          lineRVRs.push(`RWY ${runway} ${parsedSegments.join(' ')}`);
          
          //console.log(rvrValues);
      }
      if (lineRVRs.length > 0) {
            rvrValues.push(lineRVRs.join(' ')); // Add a space between parsed values.
        }
    }

      if (rvrValues.length > 0) {
          return { rvr: rvrValues.join(' ') };
      } else {
          return { rvr: 'N/A' };
      }
    },

    parseWeather(data) {
    // Intensity codes
    const intensityCodes = ['FBL', 'MOD', 'HVY'];

    // Weather characteristic codes
    const weatherCharCodes = [
        'DZ', 'RA', 'SN', 'SG', 'PL', 'DS', 'SS', 'FZDZ', 'FZUP', 'FC', 'FZRA', 'SHGR', 'SHGS',
        'SHRA', 'SHSN', 'SHUP', 'TSGR', 'TSGS', 'TSRA', 'TSSN', 'TSUP', 'UP', 'FG', 'BR', 'SA',
        'DU', 'HZ', 'FU', 'VA', 'SQ', 'PO', 'TS', 'BCFG', 'BLDU', 'BLSA', 'BLSN', 'DRDU', 'DRSA', 'DRSN',
        'FZFG', 'MIFG', 'PRFG'
    ];

    // Regular expression to match optional intensity and the weather codes
    const weatherRegex = new RegExp('(?:\\b(' + intensityCodes.join('|') + ')? ?(' + weatherCharCodes.join('|') + ')\\b)', 'g');

    const matches = data.match(weatherRegex);
    if (matches) {
        const weather = matches.join(' ');
        return { weather };
    }
    return { weather: 'N/A' };
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
        return { dewPoint: `${dewPointMatch[1]}` };
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
        return { temperature: `${tempMatch[1]}` };
      }
    }
    
    return { temperature: 'N/A' };  // return "N/A" if no temperature data was found
},


    parseVisibility(data) {
     // Split the content into words by spaces
    const words = data.split(/\s+/);

    // Check for 'CAVOK' case
    const cavokIndex = words.indexOf('CAVOK');
    if (cavokIndex !== -1) {
      return { visibility: 'CAVOK' };
    }

    // Find the index of "VIS" in the words array
    const visIndex = words.findIndex(word => word === 'VIS');

    if (visIndex !== -1 && visIndex < words.length - 1) {
      // Handle detailed runway visibility information
      if (words[visIndex + 1] === 'RWY') {
        let detailedVisibility = words.slice(visIndex + 1, visIndex + 10).join(' ');
        return { visibility: detailedVisibility };
      }
      // Extract the word following "VIS"
      const visibility = words[visIndex + 1];
      return { visibility };
}

return { error: 'Visibility not found' };
},

    parseWind(data) {
    // Split the content into words by spaces
    const words = data.split(/\s+/);

    // Find the index of "WIND"
    const windIndex = words.findIndex(word => word === 'WIND');

    // Check for 'CAVOK' or find the index of 'VIS'
    const cavokIndex = words.indexOf('CAVOK');
    const visIndex = words.findIndex(word => word === 'VIS');

    // Determine the end index for slicing wind report
    let endIndex;
    if (cavokIndex !== -1) {
      endIndex = cavokIndex;
    } else if (visIndex !== -1) {
      endIndex = visIndex;
    } else {
      // If neither CAVOK nor VIS is found, return an error
      return { error: 'Wind report end marker not found' };
    }

    // If WIND is found and before the end marker
    if (windIndex !== -1 && windIndex < endIndex) {
      // Extract the wind report
      const windReportWords = words.slice(windIndex + 1, endIndex);
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
  const wsRegex = [
    /(\bMOD\b|\bSEV\b)?\s*WS\s+RWY\d{2}[RL]?\s+(OBS|REP|FCST)\s+ATP\s*\d{4}/gi, // Matches simple WS warnings
    /WS WRNG \d{2} \d{6} VALID (TL \d{6}|\d{6}\/\d{6}) WS (APCH|CLIMB-OUT) RWY\d{2}[RL]? FACST SFC WIND: \d{3}\/\d{2} KT/gi, // Matches detailed WS warnings with SFC wind details
    /WS WRNG \d{2} \d{6} VALID (TL \d{6}|\d{6}\/\d{6}) (MOD|SEV) WS IN APCH REP AT \d{4} \w{3,4} \d{2} KT ASPEEDL \d+ NM FNA RWY\d{2}/gi, // Another structured format
    /WS WRNG \d{6} VALID \d{6}\/\d{6} MBST CLIMBOUT RWY\d{2} FCST/gi, // Matches MBST related warnings
    /WS WRNG \d{2} \d{6} VALID \d{6}\/\d{6} WS APCH RWY \d{2} FACST SFC WIND: \d{3}\/\d{2} KT/gi // Newly added pattern for specific case
  ];

  const wsLines = [];
  // Iterate through each regex to find matches
  wsRegex.forEach(regex => {
    let match;
    while ((match = regex.exec(data)) !== null) {
      wsLines.push(match[0]); // Store the entire matched string
    }
  });

  return { atisWS: wsLines.join('\n') };
},

parseQNH(data) {
 
  // Extract QNH from the data
  const qnhRegex = /QNH\s+(\d+)\s*HPA/;
    const qnhMatch = data.match(qnhRegex);
    if (qnhMatch && qnhMatch[1]) {
        console.log(qnhMatch[1]);
        return { qnh: qnhMatch[1] }; // calculate and store the mmHg value
    }
    return { error: 'N/A' };
},

parsemmHg(data) {
 
  // Extract QNH from the data
  const qnhRegex = /QNH\s+(\d+)\s*HPA/;
    const qnhMatch = data.match(qnhRegex);
    if (qnhMatch && qnhMatch[1]) {
        return { mmHg: String(Math.round(qnhMatch[1] * 0.0295301 * 100)) }; // calculate and store the mmHg value
    }
    return { error: 'N/A' };
}
    
  }
};
</script>

<style scoped>
/* Your styling here */
</style>
