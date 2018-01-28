import { Pie, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  methods: {
    update() {
      return
      this.renderChart(this.data, this.options)
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}