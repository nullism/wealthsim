<template>
  <v-app id="wealthsim">
    <h2>Wealth Sim</h2>
    <v-slider v-model="actorCount" thumb-label step="10" min="50" max="200" ticks></v-slider>
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