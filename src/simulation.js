export default class Simulation {
  constructor(conf, onComplete, onProgress) {
    this.conf = conf
    this.actors = []
    this.isRunning = false
    this.onComplete = onComplete
    this.onProgress = onProgress
    this.setup()
  }

  setup() {
    const wealth = this.conf.totalWealth / this.conf.actorCount
    this.totalShares = this.conf.actorCount * 10
    this.boughtShares = 0
    this.sharePrice = 0
    this.investmentPool = 0
    this.redistributionPool = 0

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
    this.doCycleTimeout(0)
  }

  done() {
    console.log("Done")
    this.actors.sort((a, b) => { b.wealth - a.wealth })
    this.isRunning = false
    console.log(this.actors)
    if (this.onComplete) {
      this.onComplete()
    }
  }

  doCycleTimeout(n) {

    for (let i = 0; i < 10; i++) {
      this.doCycle(n+i)
    }

    if (n % 100 === 0) {

      if (this.onProgress) this.onProgress(n)
    }
    if (n >= this.conf.cycleCount) {
      this.done()
      return
    }
    setTimeout(() => {
      this.doCycleTimeout(n+10)
    }, 1)
  }

  doCycle(n) {
    for (let actor of this.actors) {

      // Investment
      this.doInvestment(actor)

      // Spending
      this.doSpend(actor)

      // Wealth Redistribution
      this.doRedistribution(actor)

    }
  }

  doInvestment(actor) {
    if (this.conf.investPct === 0) return null

    this.sharePrice = (
      (this.boughtShares / this.totalShares) *
      (this.conf.totalWealth / this.conf.actorCount)
    )
    let sharesLeft = this.totalShares - this.boughtShares
    let investable = actor.wealth * this.conf.investPct

    // Buy Share
    if (sharesLeft > 0 && investable > this.sharePrice) {
      actor.wealth -= this.sharePrice;
      actor.shares += 1;
      this.investmentPool += this.sharePrice;
      this.boughtShares += 1;
    }

    // Pay dividends
    if (this.boughtShares > 0) {
      let sharePct = actor.shares / boughtShares;
      if (sharePct > 0) {
        let earned = this.investmentPool * sharePct;
        actor.wealth += earned;
        this.investmentPool -= earned;
      }
    }
  }

  doSpend(actor) {

    if (actor.wealth < this.conf.spendAmount) return null

    actor.wealth -= this.conf.spendAmount;
    actor.spent += this.conf.spendAmount;

    if (Math.random() < this.conf.companyChance && this.conf.investPct > 0) {
      // Buy something from company
      this.investmentPool += this.conf.spendAmount;
    } else {

      // Give to another random actor
      let actor2 = this.actors[Math.floor(Math.random() * this.actors.length)];
      actor2.wealth += this.conf.spendAmount;
    }
  }

  doRedistribution(actor) {
    // Wealth redistribution
    let distribute = actor.wealth * this.conf.redistribution;
    if (distribute > 0) {
      this.redistributionPool += distribute;
      actor.wealth -= distribute;
    }

    // Collect redistribution
    if (this.redistributionPool > 0) {
      let collect = this.redistributionPool / this.conf.actorCount;
      this.redistributionPool -= collect;
      actor.wealth += collect;
    }
  }

}