import { MineballState } from '@mineball/shared';

export interface ProtocolMetrics {
  // Supply metrics
  totalSupply: bigint;
  circulatingSupply: bigint;
  burnedSupply: bigint;
  burnRate: number;
  
  // Pool metrics
  rewardPoolBalance: bigint;
  buybackPoolBalance: bigint;
  liquidityPoolBalance: bigint;
  totalPoolValue: bigint;
  
  // Activity metrics
  totalCycles: bigint;
  totalVolume: bigint;
  averageVolumePerCycle: bigint;
  
  // Distribution metrics
  totalRewardsDistributed: bigint;
  totalBuybacksExecuted: bigint;
  totalLiquidityAdded: bigint;
  
  // Tax metrics
  taxRate: number;
  effectiveTaxCollected: bigint;
}

/**
 * Calculate comprehensive protocol metrics
 */
export function calculateProtocolMetrics(state: MineballState): ProtocolMetrics {
  const circulatingSupply = state.totalSupply - state.totalBurned;
  const burnRate = state.totalSupply > BigInt(0)
    ? Number(state.totalBurned * BigInt(10000) / state.totalSupply) / 100
    : 0;
  
  const totalPoolValue = state.miningRewardPool + state.buybackPool + state.liquidityPool;
  
  const averageVolumePerCycle = state.totalMiningCycles > BigInt(0)
    ? state.totalVolume / state.totalMiningCycles
    : BigInt(0);
  
  const effectiveTaxCollected = 
    state.totalRewardsDistributed +
    state.totalBuybackExecuted +
    state.totalLiquidityAdded +
    state.totalBurned;
  
  return {
    totalSupply: state.totalSupply,
    circulatingSupply,
    burnedSupply: state.totalBurned,
    burnRate,
    rewardPoolBalance: state.miningRewardPool,
    buybackPoolBalance: state.buybackPool,
    liquidityPoolBalance: state.liquidityPool,
    totalPoolValue,
    totalCycles: state.totalMiningCycles,
    totalVolume: state.totalVolume,
    averageVolumePerCycle,
    totalRewardsDistributed: state.totalRewardsDistributed,
    totalBuybacksExecuted: state.totalBuybackExecuted,
    totalLiquidityAdded: state.totalLiquidityAdded,
    taxRate: state.taxRate,
    effectiveTaxCollected,
  };
}

/**
 * Calculate holder metrics
 */
export interface HolderMetrics {
  balance: bigint;
  shareOfSupply: number;
  estimatedRewards: bigint;
  rewardsPerCycle: bigint;
}

export function calculateHolderMetrics(
  holderBalance: bigint,
  totalSupply: bigint,
  rewardPool: bigint
): HolderMetrics {
  const shareOfSupply = totalSupply > BigInt(0)
    ? Number(holderBalance * BigInt(10000) / totalSupply) / 100
    : 0;
  
  const estimatedRewards = totalSupply > BigInt(0)
    ? (rewardPool * holderBalance) / totalSupply
    : BigInt(0);
  
  return {
    balance: holderBalance,
    shareOfSupply,
    estimatedRewards,
    rewardsPerCycle: estimatedRewards,
  };
}
