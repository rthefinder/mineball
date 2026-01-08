#!/usr/bin/env node

/**
 * Simulation script to test mineball flywheel mechanics
 * Simulates multiple transactions and pool behaviors
 */

const anchor = require('@project-serum/anchor');

// Simulation parameters
const SIMULATION_CONFIG = {
  numTransactions: 100,
  avgTransactionSize: 10000, // 0.01 token with 6 decimals
  taxRate: 600, // 6%
  miningRewardShare: 4000, // 40%
  buybackShare: 3000, // 30%
  liquidityShare: 2000, // 20%
  burnShare: 1000, // 10%
  rewardThreshold: 1000000, // 1 token
  buybackThreshold: 500000, // 0.5 token
  liquidityThreshold: 500000, // 0.5 token
};

class FlywheelSimulator {
  constructor(config) {
    this.config = config;
    this.state = {
      totalVolume: 0,
      miningRewardPool: 0,
      buybackPool: 0,
      liquidityPool: 0,
      totalBurned: 0,
      cycles: 0,
      rewardsDistributed: 0,
      buybacksExecuted: 0,
      liquidityAdded: 0,
    };
  }
  
  calculateTax(amount) {
    return Math.floor((amount * this.config.taxRate) / 10000);
  }
  
  distributeTax(taxAmount) {
    const mining = Math.floor((taxAmount * this.config.miningRewardShare) / 10000);
    const buyback = Math.floor((taxAmount * this.config.buybackShare) / 10000);
    const liquidity = Math.floor((taxAmount * this.config.liquidityShare) / 10000);
    const burn = taxAmount - mining - buyback - liquidity;
    
    return { mining, buyback, liquidity, burn };
  }
  
  processTransaction(amount) {
    this.state.totalVolume += amount;
    
    const tax = this.calculateTax(amount);
    const distribution = this.distributeTax(tax);
    
    this.state.miningRewardPool += distribution.mining;
    this.state.buybackPool += distribution.buyback;
    this.state.liquidityPool += distribution.liquidity;
    this.state.totalBurned += distribution.burn;
    
    // Check triggers
    this.checkTriggers();
  }
  
  checkTriggers() {
    let triggered = false;
    
    if (this.state.miningRewardPool >= this.config.rewardThreshold) {
      this.state.rewardsDistributed += this.state.miningRewardPool;
      this.state.miningRewardPool = 0;
      triggered = true;
      console.log(`  💰 Rewards distributed!`);
    }
    
    if (this.state.buybackPool >= this.config.buybackThreshold) {
      this.state.buybacksExecuted += this.state.buybackPool;
      this.state.buybackPool = 0;
      triggered = true;
      console.log(`  📈 Buyback executed!`);
    }
    
    if (this.state.liquidityPool >= this.config.liquidityThreshold) {
      this.state.liquidityAdded += this.state.liquidityPool;
      this.state.liquidityPool = 0;
      triggered = true;
      console.log(`  🌊 Liquidity added!`);
    }
    
    if (triggered) {
      this.state.cycles++;
      console.log(`  ⛏️ Mining cycle ${this.state.cycles} completed!\n`);
    }
  }
  
  run() {
    console.log('🔄 Starting mineball flywheel simulation...\n');
    console.log('Configuration:');
    console.log(`  Transactions: ${this.config.numTransactions}`);
    console.log(`  Avg Size: ${this.config.avgTransactionSize / 1000000} tokens`);
    console.log(`  Tax Rate: ${this.config.taxRate / 100}%\n`);
    
    for (let i = 0; i < this.config.numTransactions; i++) {
      // Randomize transaction size slightly
      const variance = 0.5 + Math.random();
      const amount = Math.floor(this.config.avgTransactionSize * variance);
      
      console.log(`Transaction ${i + 1}: ${amount / 1000000} tokens`);
      this.processTransaction(amount);
    }
    
    this.printResults();
  }
  
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 SIMULATION RESULTS');
    console.log('='.repeat(60));
    console.log(`\nTotal Volume: ${this.state.totalVolume / 1000000} tokens`);
    console.log(`Mining Cycles Completed: ${this.state.cycles}`);
    console.log(`\nPools:`);
    console.log(`  Reward Pool: ${this.state.miningRewardPool / 1000000} tokens`);
    console.log(`  Buyback Pool: ${this.state.buybackPool / 1000000} tokens`);
    console.log(`  Liquidity Pool: ${this.state.liquidityPool / 1000000} tokens`);
    console.log(`\nDistributions:`);
    console.log(`  Total Rewards Distributed: ${this.state.rewardsDistributed / 1000000} tokens`);
    console.log(`  Total Buybacks Executed: ${this.state.buybacksExecuted / 1000000} tokens`);
    console.log(`  Total Liquidity Added: ${this.state.liquidityAdded / 1000000} tokens`);
    console.log(`  Total Burned: ${this.state.totalBurned / 1000000} tokens`);
    
    const totalTax = (this.state.rewardsDistributed + 
                      this.state.buybacksExecuted + 
                      this.state.liquidityAdded + 
                      this.state.totalBurned +
                      this.state.miningRewardPool +
                      this.state.buybackPool +
                      this.state.liquidityPool);
    
    console.log(`\nTotal Tax Collected: ${totalTax / 1000000} tokens`);
    console.log(`Effective Tax Rate: ${((totalTax / this.state.totalVolume) * 100).toFixed(2)}%`);
    
    console.log('\n' + '='.repeat(60));
  }
}

// Run simulation
const simulator = new FlywheelSimulator(SIMULATION_CONFIG);
simulator.run();
