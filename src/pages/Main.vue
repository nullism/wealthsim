<template>
  <div>
    <v-card>
      <v-card-text>
        <v-btn color="primary" @click="start" :disabled="isRunning">Run {{ cyclesDone }} / {{ conf.cycleCount }}</v-btn>
        Poorest Person: ${{sim.poorestActor}}
        Richest Person: ${{sim.richestActor}}
      </v-card-text>
    </v-card>
    <v-expansion-panel expand>
      <v-expansion-panel-content>
        <div slot="header">Basic Settings</div>
        <v-card>
          <v-subheader>Number of People</v-subheader>
          <v-card-text>
            <v-slider v-model="conf.actorCount" thumb-label step="10" min="50" max="200" ticks></v-slider>
            This determines the number of people participating in the simulated economy. More people takes longer to simulate.
          </v-card-text>
          <v-subheader>Total Wealth</v-subheader>
          <v-card-text>
            <v-slider v-model="conf.totalWealth" thumb-label step="1000" min="1000" max="10000" ticks></v-slider>
            The total amount of wealth within the economy. Since it's a closed economy, wealth can never be more than this amount.
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
          actorCount: 100,
          totalWealth: 10000,
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
    computed: {
      res() {
        return {}
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
      }
    },
    components: {
    }
  }
</script>