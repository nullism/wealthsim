<template>
  <div>
    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="start" :disabled="isRunning">Run</v-btn>
        Cycles Ran: {{ cyclesDone }} / {{ conf.cycleCount }}
        <br> Poorest Person: ${{getPoorestWealth()}} Richest Person: ${{getRichestWealth()}}
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
              <v-select v-bind:items="investPctItems"
                item-value="v" item-text="t" v-model="conf.investPct" label="Investment Percent"
                hint="This is the percentage of wealth that can be used to buy a share. Share price is dynamic and increases based on how many shares remain."
                persistent-hint></v-select>
            </v-card-text>

            <v-card-text>
              <v-select v-bind:items="investPctItems"
                item-value="v" item-text="t" v-model="conf.companyChance" label="Company Purchase Percent"
                hint="This is the percentage of each person's spending that will go to a company (and thus shareholders) instead of other people. Only works if Investment Percent is greater than zero."
                persistent-hint></v-select>
            </v-card-text>

          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
  </div>
</template>

<script>
  import Simulation from "../simulation.js"
  export default {
    data() {
      return {
        conf: {
          actorCount: 50,
          startWealth: 100,
          cycleCount: 10000,
          investPct: 0,
          spendAmount: 1,
          companyChance: 0.0,
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
        this.isRunning = false
      },
      progress(cycle) {
        this.cyclesDone = cycle
      },
      getRichestWealth() {
        if (this.sim.actors && !this.isRunning) {
          return this.sim.actors[this.sim.actors.length - 1].wealth
        }
        return 0
      },
      getPoorestWealth() {
        if (this.sim.actors && !this.isRunning) {
          return this.sim.actors[0].wealth
        }
        return 0
      },
    },
    components: {
    }
  }
</script>