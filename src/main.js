new Vue({
  el: '#app',
  data: {
    entries: null,
    err: null,
    original: null,
    filename: '',
    hideUnselected: false,
    searchText: '',
  },
  computed: {
    fileopened: function() {
      return this.entries && this.entries.length
    },
    hideUnselectedImg: function() {
      if (this.hideUnselected) {
        // Source: https://www.iconfinder.com/icons/2561429/eye_off_icon
        return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZmlsbD0ibm9uZSIgaGVpZ2h0PSIyNCIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE3Ljk0IDE3Ljk0QTEwLjA3IDEwLjA3IDAgMCAxIDEyIDIwYy03IDAtMTEtOC0xMS04YTE4LjQ1IDE4LjQ1IDAgMCAxIDUuMDYtNS45NE05LjkgNC4yNEE5LjEyIDkuMTIgMCAwIDEgMTIgNGM3IDAgMTEgOCAxMSA4YTE4LjUgMTguNSAwIDAgMS0yLjE2IDMuMTltLTYuNzItMS4wN2EzIDMgMCAxIDEtNC4yNC00LjI0Ii8+PGxpbmUgeDE9IjEiIHgyPSIyMyIgeTE9IjEiIHkyPSIyMyIvPjwvc3ZnPg=='
      } else {
        // Source: https://www.iconfinder.com/icons/2561430/eye_icon
        return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZmlsbD0ibm9uZSIgaGVpZ2h0PSIyNCIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMTJzNC04IDExLTggMTEgOCAxMSA4LTQgOC0xMSA4LTExLTgtMTEtOHoiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIi8+PC9zdmc+'
      }
    },
    hideUnselectedTooltip: function() {
      return this.hideUnselected ? 'Show unchecked requests' : 'Hide unchecked requests'
    },
  },
  methods: {
    loadFile: function(ev) {
      this.entries = null
      this.err = null

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
      this.entries.forEach(entry => {
        if (this.searchText === '' || entry.url.search(regex) === -1) {
          entry.searchResult = false
        } else {
          entry.searchResult = true
        }
      })
    }, // /onSearch
  },
})
