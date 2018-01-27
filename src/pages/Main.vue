<template>
  <v-app id="wealthsim">
    <v-expansion-panel expand>
      <div slot="header">Basic Settings</div>
      <v-card>
        <v-subheader>Number of People</v-subheader>
        <v-card-text>
          <v-slider v-model="actorCount" thumb-label step="10" min="50" max="200" ticks></v-slider>
          This determines the number of people participating in the simulated economy. More people takes longer to simulate.
        </v-card-text>
      </v-card>
    </v-expansion-panel>
  </v-app>
</template>

<script>

  export default {
    data() {
      return {
        actorCount: 100,
        totalWealth: 1000,
      }

    },
    components: {
    }
  }
</script>