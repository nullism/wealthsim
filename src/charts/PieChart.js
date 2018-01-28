import { Pie } from 'vue-chartjs'

export default {
  extends: Pie,
  props: ['data', 'options'],
  methods: {
    update() {
      this.renderChart(this.data, this.options)
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}