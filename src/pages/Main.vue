<template>
  <div>
    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="start" :disabled="isRunning">Run</v-btn>
        <br> Cycles Ran: {{ cyclesDone }} / {{ conf.cycleCount }}
        <br> Poorest Person: ${{getPoorestWealth()}}
        <br> Richest Person: ${{getRichestWealth()}}
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Top and Bottom 50% Wealth Gap</h3>
            <pie-chart :chart-data="chartGap5050Data" :options="chartOptions"></pie-chart>
          </v-flex>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Richest and Poorest Person</h3>
            <bar-chart :chart-data="chartPoorestRichestData" :options="chartOptions"></bar-chart>
          </v-flex>
          <v-flex xs12 sm6 md4 lg3>
            <h3>Wealth By Person</h3>
            <bar-chart :chart-data="chartActorsData" :options="chartOptions"></bar-chart>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header"><b>Basic Settings</b></div>
        <v-card>
          <v-card-text>
            <v-select v-bind:items="[10, 25, 50, 75, 100]" v-model="conf.actorCount" label="Number of People"
              hint="This determines the number of people participating in the simulated economy. More people takes longer to simulate."
              persistent-hint></v-select>
          </v-card-text>

          <v-card-text>
            <v-select v-bind:items="[10, 50, 100, 200]" v-model="conf.startWealth" label="Wealth Per Person"
              hint="The amount of money each person starts with by default."
              persistent-hint></v-select>
          </v-card-text>

          <v-card-text>
            <v-select v-bind:items="[1, 2, 5, 10]" v-model="conf.spendAmount" label="Spending Per Person Per Cycle"
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
              <v-select v-bind:items="redistributionItems"
                item-value="v" item-text="t" v-model="conf.redistribution" label="Wealth Redistribution"
                hint="The percentage of each person's wealth that is redistributed among all people each cycle."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="investPctItems"
                item-value="v" item-text="t" v-model="conf.investPct" label="Investment Percent"
                hint="This is the percentage of wealth that can be used to buy a share. Share price is dynamic and increases based on how many shares remain."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="investPctItems"
                item-value="v" item-text="t" v-model="conf.companyChance" label="Company Purchase Percent"
                hint="This is the percentage of each person's spending that will go to a company (and thus shareholders) instead of a random person. Only works if Investment Percent is greater than zero."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="cycleItems"
                item-value="v" item-text="t" v-model="conf.cycleCount" label="Cycles"
                hint="This is the number of cycles to simulate. Higher values will take significantly longer but provide a larger sample size."
                persistent-hint></v-select>
            </v-card-text>

          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
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
          actorCount: 50,
          startWealth: 100,
          cycleCount: 1000,
          investPct: 0,
          spendAmount: 2,
          companyChance: 0.01,
          redistribution: 0.0,
        },
        sim: {},
        cyclesDone: 0,
        isRunning: false,
        investPctItems: [
          { t: "Off", v: 0 },
          { t: "Tiny (1%)", v: 0.01 },
          { t: "Small (10%)", v: 0.1 },
          { t: "Moderate (25%)", v: 0.25 },
          { t: "Large (50%)", v: 0.5 },
        ],
        cycleItems: [
          { t: "1,000", v: 1000 },
          { t: "2,000", v: 2000 },
          { t: "5,000", v: 5000 },
          { t: "10,000", v: 10000 },
          { t: "50,000", v: 50000 },
          { t: "100,000", v: 100000 },
        ],
        redistributionItems: [
          { t: "Off", v: 0 },
          { t: "Tiny (1%)", v: 0.01 },
          { t: "Small (5%)", v: 0.05 },
          { t: "Moderate (10%)", v: 0.1 },
          { t: "Large (25%)", v: 0.25 },
        ],
        chartGap5050Data: {
          labels: ["Bottom 50%", "Top 50%"],
          datasets: [
            {
              label: "Initial",
              data: [50, 50],
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
              label: "Wealth By Person",
              data: [100],
              backgroundColor: "#f55",
            }
          ]
        },
        chartPoorestRichestData: {
          labels: ["Poorest", "Richest"],
          datasets: [
            {
              label: "Wealth",
              data: [100, 100],
              backgroundColor: "#f55",
            }
          ]
        },
        chartOptions: {
          responsive: true,
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
        console.log("Got done in Main")
        this.updateCharts()
        this.isRunning = false
      },
      progress(cycle) {
        this.cyclesDone = cycle
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
        copy.labels = this.sim.actors.map((a) => a.id)
        console.log(copy.datasets[0].data)
        this.chartActorsData = copy

        // Richest and Poorest Person Chart
        copy = Object.assign({}, this.chartPoorestRichestData)
        copy.datasets[0].data = [
          this.getPoorestWealth(),
          this.getRichestWealth()
        ]
        this.chartPoorestRichestData = copy
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
    }
  }
</script>