const HAR = {
  load: (filename, cb) => {
    const reader = new FileReader()

    reader.onload = e => {
      let json = ''

      try {
        json = JSON.parse(e.target.result)
      } catch(err) {
        console.log(err)
        return cb('Invalid JSON in input file')
      }

      if (!json || !json.log || !Array.isArray(json.log.entries)) {
        return cb('File not in HAR format')
      }

      cb(null, json)
    }

    try {
      reader.readAsText(filename)
    } catch(err) {
      console.log(err)
      return cb('Cannot open file')
    }
  },
  save: (filename, json) => {
    const text = JSON.stringify(json, null, 2)
    const blob = new Blob([text], {type: 'text/plain'})

    // We use FileSaver's saveAs method for better browser compatibility
    saveAs(blob, filename)
  }
}
