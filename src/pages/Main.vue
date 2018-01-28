<template>
  <div>
    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="start" :disabled="isRunning">Run</v-btn>
        <br> Cycles Ran: {{ cyclesDone }} / {{ conf.cycleCount }}
        <br> Poorest Person: ${{getPoorestWealth()}}
        <br> Richest Person: ${{getRichestWealth()}}
        <pie-chart :data="chartGap5050Data" ref="chartGap5050"></pie-chart>
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
  import PieChart from "../charts/PieChart.js"

  export default {
    data() {
      return {
        conf: {
          actorCount: 50,
          startWealth: 100,
          cycleCount: 10000,
          investPct: 0,
          spendAmount: 1,
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
            }
          ]
        }
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

        this.chartGap5050Data.datasets[0].data = [
          this.sim.getBottomWealth(0.5),
          80
        ]
        this.$refs.chartGap5050.update()
        this.isRunning = false
      },
      progress(cycle) {
        this.cyclesDone = cycle
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
      PieChart
    }
  }
</script>