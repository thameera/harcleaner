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
    fileopened: function() { // Whether a HAR file is opened right now
      return this.entries && this.entries.length
    },
    hideUnselectedImg: function() { // Icon for 'Hide unchecked requests' button
      return this.hideUnselected ? ICONS.eye_off : ICONS.eye_on
    },
    hideUnselectedTooltip: function() { // Tooltip for 'Hide unchecked requests' button
      return this.hideUnselected ? 'Show all requests' : 'Hide unchecked requests'
    },
    searchResCount: function() { // Current search result count
      return this.entries.filter(e => e.searchResult).length
    },
    checkedCount: function() { // Checked item count
      return this.entries.filter(e => e.selected).length
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

        this.original = input // we keep this to use when saving the file at thend
        this.filename = ev.target.files[0].name

        this.entries = input.log.entries.map(entry => {
          let urlpath
          try {
            const url = new URL(entry.request.url)
            urlpath = `${url.origin}${url.pathname}` // get rid of query params and hash fragment
          } catch(err) {
            // this can happen when the url isn't actually a URL
            urlpath = entry.request.url || ''
          }
          return {
            selected: true, // all requests are selected at the beginning
            url: urlpath,
            method: entry.request.method,
            status: entry.response.status,
            searchResult: false,
            data: entry, // actual data of the request from HAR
          }
        })
      })
    }, // /loadFile

    saveFile: function() {
      // create a copy of original
      const out = JSON.parse(JSON.stringify(this.original))

      // Output only selected entries
      out.log.entries = this.entries.filter(entry => entry.selected).map(entry => entry.data)

      // Append `_cleaned` to new filename
      const f = this.filename
      let dotloc = f.lastIndexOf('.')
      const filename = dotloc > -1 ? `${f.substr(0, dotloc)}_cleaned${f.substr(dotloc)}` : `${f}_cleaned.har`

      HAR.save(filename, out)
    }, // /saveFile

    onSearchBy: function(searchBy) {
      this.searchText = searchBy
      this.onSearch()
    }, // /onSearchBy

    onSearch: function() {
      const searchText = this.searchText.trim()
      const regex = new RegExp(searchText, 'i')

      // Set `searchResult = true` in all entries where search is matched
      this.entries = this.entries.map(entry => {
        entry.searchResult = (searchText !== '') && (entry.url.search(regex) > -1)
        return entry
      })
    }, // /onSearch

    uncheckSearchResults: function() {
      if (this.searchResCount === 0) return

      this.entries = this.entries.map(entry => {
        if (entry.searchResult) entry.selected = false
        return entry
      })
    }, // /uncheckSearchResults
  },
})
