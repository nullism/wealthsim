<template>
  <div>
    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="start" :disabled="isRunning">Run</v-btn>
        Cycles Ran: {{ cyclesDone }} / {{ conf.cycleCount }}<br>
        Poorest Person: ${{getPoorestWealth()}}
        Richest Person: ${{getRichestWealth()}}
      </v-card-text>
    </v-card>
    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header">Basic Settings</div>
        <v-card>
          <v-subheader>Number of People</v-subheader>
            <v-slider v-model="conf.actorCount" thumb-label step="10" min="50" max="200" ticks></v-slider>
            This determines the number of people participating in the simulated economy. More people takes longer to simulate.
          <v-subheader>Wealth Per Person</v-subheader>
            <v-slider v-model="conf.startWealth" thumb-label step="10" min="10" max="200" ticks></v-slider>
            The amount of money each person starts with by default.
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
          actorCount: 100,
          startWealth: 100,
          cycleCount: 10000,
          investPct: 0.0,
          spendAmount: 1,
          companyChance: 0.0,
          redistribution: 0.0,
        },
        sim: {},
        cyclesDone: 0,
        isRunning: false,
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
          return this.sim.actors[this.sim.actors.length-1].wealth
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