import { PublicKey } from '@solana/web3.js';
import {
  STATE_SEED,
  HOLDER_SEED,
  REWARD_POOL_SEED,
  BUYBACK_POOL_SEED,
  LIQUIDITY_POOL_SEED,
  MINEBALL_PROGRAM_ID,
} from './constants';

/**
 * Derive the mineball state PDA
 */
export function deriveStatePDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(STATE_SEED)],
    MINEBALL_PROGRAM_ID
  );
}

/**
 * Derive a holder info PDA
 */
export function deriveHolderPDA(holder: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(HOLDER_SEED), holder.toBuffer()],
    MINEBALL_PROGRAM_ID
  );
}

/**
 * Derive the reward pool PDA
 */
export function deriveRewardPoolPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(REWARD_POOL_SEED)],
    MINEBALL_PROGRAM_ID
  );
}

/**
 * Derive the buyback pool PDA
 */
export function deriveBuybackPoolPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(BUYBACK_POOL_SEED)],
    MINEBALL_PROGRAM_ID
  );
}

/**
 * Derive the liquidity pool PDA
 */
export function deriveLiquidityPoolPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LIQUIDITY_POOL_SEED)],
    MINEBALL_PROGRAM_ID
  );
}

/**
 * Format a token amount with decimals
 */
export function formatTokenAmount(amount: bigint, decimals: number = 6): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const fraction = amount % divisor;
  return `${whole}.${fraction.toString().padStart(decimals, '0')}`;
}

/**
 * Parse a token amount string to bigint
 */
export function parseTokenAmount(amount: string, decimals: number = 6): bigint {
  const [whole, fraction = '0'] = amount.split('.');
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
  return BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction);
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount: bigint, taxRate: number): bigint {
  return (amount * BigInt(taxRate)) / BigInt(10000);
}

/**
 * Calculate share of a pool
 */
export function calculateShare(total: bigint, share: number): bigint {
  return (total * BigInt(share)) / BigInt(10000);
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}
