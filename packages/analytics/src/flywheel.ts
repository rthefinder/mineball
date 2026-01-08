import { MineballState } from '@mineball/shared';

export interface FlywheelMetrics {
  totalVolume: bigint;
  accumulatedRewards: bigint;
  accumulatedBuybacks: bigint;
  accumulatedLiquidity: bigint;
  averageCycleVolume: bigint;
  flywheelVelocity: number;
  growthRate: number;
}

/**
 * Calculate flywheel metrics from protocol state
 */
export function calculateFlywheelMetrics(state: MineballState): FlywheelMetrics {
  const cycles = Number(state.totalMiningCycles);
  
  const averageCycleVolume = cycles > 0 
    ? state.totalVolume / BigInt(cycles)
    : BigInt(0);
  
  // Velocity: how much value flows through the system per cycle
  const totalPoolValue = state.miningRewardPool + state.buybackPool + state.liquidityPool;
  const flywheelVelocity = cycles > 0
    ? Number(totalPoolValue) / cycles
    : 0;
  
  // Growth rate: compare recent activity to historical average
  const recentVolume = state.totalVolume;
  const expectedVolume = averageCycleVolume * BigInt(Math.max(1, cycles));
  const growthRate = expectedVolume > BigInt(0)
    ? Number(recentVolume * BigInt(100) / expectedVolume) / 100
    : 1.0;
  
  return {
    totalVolume: state.totalVolume,
    accumulatedRewards: state.totalRewardsDistributed,
    accumulatedBuybacks: state.totalBuybackExecuted,
    accumulatedLiquidity: state.totalLiquidityAdded,
    averageCycleVolume,
    flywheelVelocity,
    growthRate,
  };
}

/**
 * Calculate the health of the flywheel (0-100 score)
 */
export function calculateFlywheelHealth(state: MineballState): number {
  let score = 0;
  
  // Pool balances (30 points)
  const poolScore = Math.min(30, 
    (Number(state.miningRewardPool) / Number(state.rewardDistributionThreshold)) * 10 +
    (Number(state.buybackPool) / Number(state.buybackThreshold)) * 10 +
    (Number(state.liquidityPool) / Number(state.liquidityThreshold)) * 10
  );
  score += poolScore;
  
  // Volume consistency (30 points)
  const volumeScore = state.totalVolume > BigInt(0) ? 30 : 0;
  score += volumeScore;
  
  // Distribution activity (20 points)
  const distributionScore = state.totalRewardsDistributed > BigInt(0) ? 20 : 0;
  score += distributionScore;
  
  // Time since last activity (20 points)
  const now = Math.floor(Date.now() / 1000);
  const daysSinceReward = (now - state.lastRewardDistribution) / 86400;
  const activityScore = Math.max(0, 20 - daysSinceReward * 2);
  score += activityScore;
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Estimate time until next trigger
 */
export function estimateNextTrigger(
  currentPool: bigint,
  threshold: bigint,
  recentVolume: bigint,
  taxRate: number,
  poolShare: number
): number {
  if (currentPool >= threshold) return 0;
  
  const remaining = threshold - currentPool;
  const volumeNeeded = (remaining * BigInt(10000)) / BigInt(taxRate * poolShare);
  
  // Estimate based on recent volume (simplified)
  const estimatedCycles = recentVolume > BigInt(0)
    ? Number(volumeNeeded / recentVolume)
    : Infinity;
  
  return estimatedCycles;
}
