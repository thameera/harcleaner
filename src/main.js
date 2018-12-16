new Vue({
  el: '#app',
  data: {
    entries: null,
    err: null,
    original: null,
    filename: '',
    hideUnselected: false,
    searchText: '',
    sweepIcon: ICONS.trash,
  },
  computed: {
    fileopened: function() {
      return this.entries && this.entries.length
    },
    hideUnselectedImg: function() {
      return this.hideUnselected ? ICONS.eye_off : ICONS.eye_on
    },
    hideUnselectedTooltip: function() {
      return this.hideUnselected ? 'Show unchecked requests' : 'Hide unchecked requests'
    },
    searchResCount: function() {
      return this.entries.reduce((count, entry) => {
        return count + (entry.searchResult ? 1 : 0)
      }, 0)
    },
  },
  methods: {
    loadFile: function(ev) {
      this.entries = null
      this.err = null
      this.searchText = ''

      HAR.load(ev.target.files[0], (err, input) => {
        if (err) {
          this.err = err
          return
        }

        this.original = input
        this.filename = ev.target.files[0].name

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
            searchResult: false,
            data: entry,
          }
        })
        console.log(this.entries)
      })
    }, // /loadFile
    saveFile: function() {
      // create a copy of original
      const out = JSON.parse(JSON.stringify(this.original))

      // Set only selected entries
      out.log.entries = this.entries.filter(entry => entry.selected).map(entry => entry.data)

      const f = this.filename
      let dotloc = f.lastIndexOf('.')
      const filename = dotloc > -1 ? `${f.substr(0, dotloc)}_cleaned${f.substr(dotloc)}` : `${f}_cleaned.har`

      HAR.save(filename, out)
    }, // /saveFile
    onSearch: function() {
      const regex = new RegExp(this.searchText, 'i')
      this.entries = this.entries.map(entry => {
        if (this.searchText === '' || entry.url.search(regex) === -1) {
          entry.searchResult = false
        } else {
          entry.searchResult = true
        }
        return entry
      })
    }, // /onSearch
    uncheckSearchResults: function() {
      this.entries = this.entries.map(entry => {
        if (entry.searchResult) entry.selected = false
        return entry
      })
    }, // /uncheckSearchResults
  },
})
