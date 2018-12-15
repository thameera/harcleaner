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
    <div class="entry" v-bind:class="{ unselected: !data.selected }">
      <div class="check togglable" v-on:click="$emit('toggle')">
        <label>
          <input type="checkbox" v-model="data.selected">
          <span class="checkable"></span>
        </label>
      </div>
      <div class="httpstatus togglable" v-bind:class="statusClass" v-on:click="$emit('toggle')">{{ data.status }}</div>
      <div class="method togglable" v-on:click="$emit('toggle')">{{ data.method }}</div>
      <div class="url">{{ data.url }}</div>
    </div>
  `,
})
