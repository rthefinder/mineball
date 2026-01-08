import { PublicKey } from '@solana/web3.js';

export interface MineballState {
  authority: PublicKey;
  mint: PublicKey;
  totalSupply: bigint;
  taxRate: number;
  miningRewardShare: number;
  buybackShare: number;
  liquidityShare: number;
  burnShare: number;
  miningRewardPool: bigint;
  buybackPool: bigint;
  liquidityPool: bigint;
  totalBurned: bigint;
  totalMiningCycles: bigint;
  totalVolume: bigint;
  totalRewardsDistributed: bigint;
  totalBuybackExecuted: bigint;
  totalLiquidityAdded: bigint;
  rewardDistributionThreshold: bigint;
  buybackThreshold: bigint;
  liquidityThreshold: bigint;
  createdAt: number;
  lastRewardDistribution: number;
  lastBuyback: number;
  lastLiquidityAdd: number;
  bump: number;
}

export interface HolderInfo {
  holder: PublicKey;
  totalRewardsEarned: bigint;
  lastClaim: number;
  pendingRewards: bigint;
  bump: number;
}

export interface TransferWithTaxEvent {
  from: PublicKey;
  to: PublicKey;
  amount: bigint;
  taxAmount: bigint;
  timestamp: number;
}

export interface RewardsDistributedEvent {
  cycle: bigint;
  amount: bigint;
  recipients: bigint;
  timestamp: number;
}

export interface BuybackExecutedEvent {
  cycle: bigint;
  amount: bigint;
  tokensBought: bigint;
  timestamp: number;
}

export interface LiquidityAddedEvent {
  cycle: bigint;
  amount: bigint;
  timestamp: number;
}

export interface MiningCycleCompletedEvent {
  cycle: bigint;
  totalVolume: bigint;
  rewardsDistributed: bigint;
  buybackExecuted: bigint;
  liquidityAdded: bigint;
  timestamp: number;
}

export interface RewardsClaimedEvent {
  holder: PublicKey;
  amount: bigint;
  timestamp: number;
}
