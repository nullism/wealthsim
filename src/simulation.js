export default class Simulation {
  constructor(conf) {
    this.conf = conf
    this.actors = []
    this.isRunning = false
    this.setup()
  }

  setup() {
    const wealth = this.conf.totalWealth / this.conf.actorCount
    this.totalShares = this.conf.actorCount * 10
    this.boughtShares = 0
    this.sharePrice = 0


    for (let i = 0; i < this.conf.actorCount; i++) {
      this.actors.push({
        id: i,
        wealth: wealth,
        shares: 0,
        startWealth: wealth,
        spent: 0
      })
    }
  }

  start() {
    console.log("Starting...")
    this.isRunning = true
    for (let i = 0; i < this.conf.cycleCount; i++) {
      this.doCycle(i)
    }
    this.isRunning = false
    console.log("Done")
    console.log(this.actors)
  }

  doCycle(n) {
    for (let actor of this.actors) {
      this.sharePrice = (
        (this.boughtShares / this.totalShares) *
        (this.conf.totalWealth / this.conf.actorCount)
      )
      let sharesLeft = this.totalShares - this.boughtShares

    }
  }

}