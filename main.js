new Vue({
  el: '#app',
  data: {
    entries: null,
    err: null,
    original: null,
    filename: '',
  },
  methods: {
    loadFile: function(ev) {
      this.entries = null
      this.err = null

      const file = ev.target.files[0]
      const reader = new FileReader()

      reader.onload = e => {
        let input = ''
        try {
          input = JSON.parse(e.target.result)
        } catch(err) {
          console.log(err)
          this.err = 'Invalid JSON in input file'
          return
        }
        if (!input || !input.log || !Array.isArray(input.log.entries)) {
          this.err = 'File not in HAR format'
          return
        }

        this.original = input
        this.filename = file.name

        this.entries = input.log.entries.map(entry => {
          let urlpath
          try {
            const url = new URL(entry.request.url)
            urlpath = `${url.origin}${url.pathname}`
          } catch(err) {
            urlpath = entry.request.url
          }
          return {
            selected: true,
            url: urlpath,
            method: entry.request.method,
            status: entry.response.status,
            data: entry,
          }
        })
        console.log(this.entries)

      }

      try {
        reader.readAsText(file)
      } catch(err) {
        console.log(err)
        this.err = 'Error opening file'
      }
    }, // /loadFile
  },
})
