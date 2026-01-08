import { PublicKey } from '@solana/web3.js';

// Program ID (update after deployment)
export const MINEBALL_PROGRAM_ID = new PublicKey('Mine11111111111111111111111111111111111111');

// Seeds for PDA derivation
export const STATE_SEED = 'mineball-state';
export const HOLDER_SEED = 'holder';
export const REWARD_POOL_SEED = 'reward-pool';
export const BUYBACK_POOL_SEED = 'buyback-pool';
export const LIQUIDITY_POOL_SEED = 'liquidity-pool';

// Tokenomics constants
export const MAX_TAX_RATE = 1000; // 10% in basis points
export const BASIS_POINTS = 10000;
export const DEFAULT_TAX_RATE = 600; // 6%

// Default shares (in basis points, must sum to 10000)
export const DEFAULT_MINING_REWARD_SHARE = 4000; // 40%
export const DEFAULT_BUYBACK_SHARE = 3000; // 30%
export const DEFAULT_LIQUIDITY_SHARE = 2000; // 20%
export const DEFAULT_BURN_SHARE = 1000; // 10%

// Thresholds
export const DEFAULT_REWARD_THRESHOLD = BigInt(1_000_000_000_000); // 1M with 6 decimals
export const DEFAULT_BUYBACK_THRESHOLD = BigInt(500_000_000_000);
export const DEFAULT_LIQUIDITY_THRESHOLD = BigInt(500_000_000_000);

// Timing
export const MIN_CLAIM_INTERVAL = 3600; // 1 hour in seconds

// Token metadata
export const TOKEN_NAME = 'mineball';
export const TOKEN_SYMBOL = '$mineball';
export const TOKEN_DECIMALS = 6;
export const TOTAL_SUPPLY = BigInt(1_000_000_000_000_000); // 1 billion with 6 decimals
