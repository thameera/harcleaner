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
    <div class="entry">
      <div class="check">
        <label>
          <input type="checkbox" v-model="data.selected">
          <span class="checkable"></span>
        </label>
      </div>
      <div class="httpstatus" v-bind:class="statusClass">{{ data.status }}</div>
      <div class="method">{{ data.method }}</div>
      <div class="url">{{ data.url }}</div>
    </div>
  `,
})
