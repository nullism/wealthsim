<template>

  <v-expansion-panel expand>
    <v-expansion-panel-content>
      <div slot="header">Basic Settings</div>
      <v-card>
        <v-subheader>Number of People</v-subheader>
        <v-card-text>
          <v-slider v-model="sim.actorCount" thumb-label step="10" min="50" max="200" ticks></v-slider>
          This determines the number of people participating in the simulated economy. More people takes longer to simulate.
        </v-card-text>
        <v-subheader>Total Wealth</v-subheader>
        <v-card-text>
          <v-slider v-model="sim.totalWealth" thumb-label step="1000" min="100" max="10000" ticks></v-slider>
          The total amount of wealth within the economy. Since it's a closed economy, wealth can never be more than this amount.
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>

</template>

<script>

  export default {
    data() {
      return {
        sim: {
          actorCount: 100,
          totalWealth: 10000,
        },
        actorCount: 100,
        totalWealth: 1000,
      }

    },
    components: {
    }
  }
</script>