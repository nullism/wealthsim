<template>
  <div>
    <v-parallax src="/img/bg.jpg">
      <v-layout column align-center justify-center>
        <h1 class="display-2">Wealth Gap Simulator</h1>
        <p></p>
        <p>
          A simulation of <b>{{conf.actorCount}}</b> people in a closed virtual economy, each starting with <b>${{conf.startWealth}}</b>.
        </p>
        <p>
          All people start with the same wealth, have the same skills and education, are equally motivated,
          and follow the same rules. See the source code on <a href="https://github.com/nullism/wealthsim">GitHub</a>.
        </p>
        <v-btn color="primary" @click="start" :disabled="isRunning" large round>Run</v-btn>
        <v-progress-linear v-model="runProgress"></v-progress-linear>
        <span class="grey--text text--lighten-2">Cycles Ran: {{ cyclesDone }} / {{ conf.cycleCount }}</span>
      </v-layout>
    </v-parallax>
    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header"><b>Basic Settings</b></div>
        <v-card>
          <v-card-text>
            <v-select v-bind:items="confItems.actorCount"
              item-value="v" item-text="t" v-model="conf.actorCount" label="Number of People"
              hint="This determines the number of people participating in the simulated economy. More people takes longer to simulate."
              persistent-hint></v-select>
          </v-card-text>

          <v-card-text>
            <v-select v-bind:items="confItems.startWealth"
              item-value="v" item-text="t" v-model="conf.startWealth" label="Wealth Per Person"
              hint="The amount of money each person starts with by default."
              persistent-hint></v-select>
          </v-card-text>

          <v-card-text>
            <v-select v-bind:items="confItems.spendAmount"
              item-value="v" item-text="t" v-model="conf.spendAmount" label="Spending Per Person Per Cycle"
              hint="The amount of money each person spends per cycle."
              persistent-hint></v-select>
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel expand>
        <v-expansion-panel-content>
          <div slot="header"><b>Advanced Settings</b></div>
          <v-card>

            <v-card-text>
              <v-select v-bind:items="confItems.redistribution"
                item-value="v" item-text="t" v-model="conf.redistribution" label="Wealth Redistribution"
                hint="The percentage of each person's wealth that is redistributed among all people each cycle."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="confItems.investPct"
                item-value="v" item-text="t" v-model="conf.investPct" label="Investment Percent"
                hint="This is the percentage of wealth that can be used to buy a share. Share price is dynamic and increases based on how many shares have been bought."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="confItems.companyChance"
                item-value="v" item-text="t" v-model="conf.companyChance" label="Company Purchase Percent"
                hint="This is the percentage of each person's spending that will go to a company (and thus shareholders) instead of a random person. Only works if Investment Percent is greater than zero."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="confItems.cycleCount"
                item-value="v" item-text="t" v-model="conf.cycleCount" label="Cycles"
                hint="This is the number of cycles to simulate. Higher values will take significantly longer but provide a larger sample size."
                persistent-hint></v-select>
            </v-card-text>

          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    <v-card flat style="background: transparent;">
      <v-card-text>
        <p>
          As configured, each cycle over the course of <b>{{conf.cycleCount}}</b> cycles, <b>each person</b> performs the following tasks:
          Selects another random person and "buys" services from them for <b>${{conf.spendAmount}}</b>;

          <template v-if="conf.investPct > 0">
            Invests <b>{{conf.investPct * 100}}%</b> of their income on buying a company share, if shares are available and they can afford them;
            <template v-if="conf.companyChance > 0">
              Has a <b>{{conf.companyChance * 100}}%</b> chance to spend <b>${{conf.spendAmount}}</b> on goods from a company,
                which manifests as dividends for shareholders;
            </template>
            Collects dividends on their company shares based on the percentage of total shares they own;
          </template>

          <template v-if="conf.redistribution > 0">
            Gives <b>{{conf.redistribution * 100}}%</b> of their wealth to the wealth redistribution pool;
            Receives <b>1/{{conf.actorCount}}<sup>th</sup></b> of the wealth redistribution pool;
          </template>
        </p>

        <h2 v-if="cyclesDone < 1">Starting Distribution</h2>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Top and Bottom 50% Wealth Share</h3>
            <pie-chart :chart-data="chartGap5050Data" :options="chartOptions"></pie-chart>
          </v-flex>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Poorest and Richest Person</h3>
            <bar-chart :chart-data="chartPRData" :options="barChartOptions"></bar-chart>
          </v-flex>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Poorest and Richest 10%</h3>
            <bar-chart :chart-data="chartPR10Data" :options="barChartOptions"></bar-chart>
          </v-flex>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Wealth By Person</h3>
            <bar-chart :chart-data="chartActorsData" :options="chartOptions"></bar-chart>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
  import Simulation from "../simulation.js"
  import * as util from "../util.js"
  // Charts
  import BarChart from "../charts/BarChart.js"
  import LineChart from "../charts/LineChart.js"
  import PieChart from "../charts/PieChart.js"


  export default {
    data() {
      return {
        conf: {
          actorCount: 100,
          startWealth: 100,
          cycleCount: 3000,
          investPct: 0,
          spendAmount: 2,
          companyChance: 0.01,
          redistribution: 0.0,
        },
        confItems: {
          actorCount: [
            { t: "10", v: 10 },
            { t: "50", v: 50 },
            { t: "100", v: 100 },
            { t: "200", v: 200 },
          ],
          startWealth: [
            { t: "10", v: 10 },
            { t: "50", v: 50 },
            { t: "100", v: 100 },
            { t: "200", v: 200 },
          ],
          spendAmount: [
            { t: "1", v: 1 },
            { t: "2", v: 2 },
            { t: "5", v: 5 },
            { t: "10", v: 10 },
          ],
          investPct: [
            { t: "Off", v: 0 },
            { t: "Tiny (1%)", v: 0.01 },
            { t: "Small (10%)", v: 0.1 },
            { t: "Moderate (25%)", v: 0.25 },
            { t: "Large (50%)", v: 0.5 },
          ],
          companyChance: [
            { t: "Tiny (1%)", v: 0.01 },
            { t: "Small (10%)", v: 0.1 },
            { t: "Moderate (25%)", v: 0.25 },
            { t: "Large (50%)", v: 0.5 },
          ],
          cycleCount: [
            { t: "1,000", v: 1000 },
            { t: "2,000", v: 2000 },
            { t: "3,000", v: 3000 },
            { t: "5,000", v: 5000 },
            { t: "10,000", v: 10000 },
            { t: "25,000", v: 25000 },
            { t: "50,000", v: 50000 },
            { t: "100,000", v: 100000 },
          ],
          redistribution: [
            { t: "Off", v: 0 },
            { t: "Tiny (1%)", v: 0.01 },
            { t: "Small (5%)", v: 0.05 },
            { t: "Moderate (10%)", v: 0.1 },
            { t: "Large (25%)", v: 0.25 },
          ],
        },
        sim: {},
        cyclesDone: 0,
        isRunning: false,
        runProgress: 0,

        chartGap5050Data: {
          labels: ["Bottom 50%", "Top 50%"],
          datasets: [
            {
              label: "Share of Wealth",
              data: [50, 50],
              borderColor: ["#02b", "#d22"],
              backgroundColor: [
                "#28f",
                "#f55",
              ]
            }
          ]
        },
        chartActorsData: {
          labels: ["Default"],
          datasets: [
            {
              label: "Wealth",
              data: [100],
              backgroundColor: "#f55",
            }
          ]
        },
        chartPRData: {
          labels: ["Poorest Person", "Richest Person"],
          datasets: [
            {
              label: "Wealth",
              data: [100, 100],
              backgroundColor: ["#28f", "#f55"],
            }
          ]
        },
        chartPR10Data: {
          labels: ["Poorest 10%", "Richest 10%"],
          datasets: [
            {
              label: "Wealth",
              data: [100, 100],
              backgroundColor: ["#28f", "#f55"],
            }
          ]
        },
        barChartOptions: {
          responsive: true,
          legend: {
            labels: {
              fontColor: "#eee"
            }
          },
          scales: {
            yAxes: [{
              ticks: { beginAtZero: true },
            }]
          }
        },
        chartOptions: {
          responsive: true,
          legend: {
            labels: {
              fontColor: "#eee"
            }
          },
        },
      }

    },
    methods: {
      start() {
        this.sim = new Simulation(this.conf, this.done, this.progress)
        this.sim.start()
        this.isRunning = true
      },
      done() {
        this.isRunning = false
        this.runProgress = 0
        this.updateCharts()
        this.updateUrl()
      },
      progress(cycle) {
        this.cyclesDone = cycle
        this.runProgress = (cycle / this.conf.cycleCount) * 100
      },
      updateUrl() {
        this.$router.push({ path: '/', query: this.conf})
      },
      updateConfFromUrl() {
        let count = 0
        for (let qkey in this.$route.query) {
          let qval = this.$route.query[qkey]
          if (!this.confItems[qkey]) continue
          // Values may be strings, so no "==="
          let qitem = this.confItems[qkey].find((ci) => ci.v == qval)
          if (!qitem) continue
          this.conf[qkey] = qitem.v
          count++
        }
        return count
      },
      updateCharts() {
        // 50:50 Pie Chart
        let copy = Object.assign({}, this.chartGap5050Data)
        copy.datasets[0].data = [
          this.sim.getBottomWealth(0.5),
          this.sim.getTopWealth(0.5),
        ]
        this.chartGap5050Data = copy

        // Per Actor Chart
        copy = Object.assign({}, this.chartActorsData)
        copy.datasets[0].data = this.sim.actors.map((a) => a.wealth)
        copy.labels = this.sim.actors.map((a) => "#" + a.id)
        this.chartActorsData = copy

        // Richest and Poorest Person Chart
        copy = Object.assign({}, this.chartPRData)
        copy.datasets[0].data = [
          this.getPoorestWealth(),
          this.getRichestWealth()
        ]
        this.chartPRData = copy

        // Richest and Poorest 10% Chart
        copy = Object.assign({}, this.chartPR10Data)
        copy.datasets[0].data = [
          this.sim.getBottomWealth(0.1),
          this.sim.getTopWealth(0.1)
        ]
        this.chartPR10Data = copy
      },
      getRichestWealth() {
        if (this.sim.actors && !this.isRunning) {
          return util.precisionRound(
            this.sim.actors[this.sim.actors.length - 1].wealth, 2)
        }
        return 0
      },
      getPoorestWealth() {
        if (this.sim.actors && !this.isRunning) {
          return util.precisionRound(this.sim.actors[0].wealth, 2)
        }
        return 0
      },
    },
    components: {
      BarChart,
      LineChart,
      PieChart,
    },
    mounted() {
      let paramCount = this.updateConfFromUrl()
      if (paramCount > 0) this.start()
    }
  }
</script>