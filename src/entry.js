Vue.component('entry', {
  props: ['data'],
  computed: {
    statusClass: function() {
      if (this.data.status < 300) return 'status-success'
      else if (this.data.status < 400) return 'status-redirect'
      else return 'status-error'
    },
  },
  template: `
    <div class="entry" v-bind:class="{ unselected: !data.selected, highlighted: data.searchResult }">
      <div class="check togglable" v-on:click="$emit('toggle')">
        <label>
          <input type="checkbox" v-model="data.selected">
          <span class="checkable"></span>
        </label>
      </div>
      <div class="httpstatus togglable" v-bind:class="statusClass" v-on:click="$emit('toggle')">{{ data.status }}</div>
      <div class="method togglable" v-on:click="$emit('toggle')">{{ data.method }}</div>
      <div class="url" v-if="data.url_protocol">
        <span class="protocol">{{ data.url_protocol }}</span><span class="domain">{{ data.url_domain }}</span><span class="path">{{ data.url_path }}</span>
      </div>
      <div class="url" v-else>{{ data.url }}</div>
    </div>
  `,
})
