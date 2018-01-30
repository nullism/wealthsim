import * as util from "./util.js"

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
    const wealth = this.conf.startWealth
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
    this.isRunning = true
    this.doCycleTimeout(0)
  }

  done() {
    for (let actor of this.actors) {
      actor.wealth = util.precisionRound(actor.wealth, 2)
    }
    this.actors.sort((a, b) => a.wealth - b.wealth)
    this.isRunning = false
    if (this.onComplete) {
      this.onComplete()
    }
  }

  // This added timeout helps lower-end CPUs cope
  doCycleTimeout(n) {

    for (let i = 0; i < 10; i++) {
      this.doCycle(n + i)
    }

    if (n % 100 === 0) {

      if (this.onProgress) this.onProgress(n)
    }
    if (n >= this.conf.cycleCount) {
      this.done()
      return
    }
    setTimeout(() => {
      this.doCycleTimeout(n + 10)
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
      this.conf.startWealth
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
      let sharePct = actor.shares / this.boughtShares;
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

  // Gets the bottom n% total wealth
  getBottomWealth(pct) {
    let count = Math.round(this.actors.length * pct)
    let wealth = 0
    for (let i = 0; i < count; i++) {
      wealth += this.actors[i].wealth
    }
    return util.precisionRound(wealth, 2)
  }

  // Gets the top n% total wealth
  getTopWealth(pct) {
    let count = Math.round(this.actors.length * pct)
    let wealth = 0
    for (let i = this.actors.length - 1; i > this.actors.length - 1 - count; i--) {
      wealth += this.actors[i].wealth
    }
    return util.precisionRound(wealth, 2)
  }

}