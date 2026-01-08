/// Maximum tax rate in basis points (10%)
pub const MAX_TAX_RATE: u16 = 1000;

/// Basis points denominator
pub const BASIS_POINTS: u16 = 10000;

/// Default reward distribution threshold (1M tokens)
pub const DEFAULT_REWARD_THRESHOLD: u64 = 1_000_000_000_000; // 1M with 6 decimals

/// Default buyback threshold (500K tokens)
pub const DEFAULT_BUYBACK_THRESHOLD: u64 = 500_000_000_000;

/// Default liquidity threshold (500K tokens)
pub const DEFAULT_LIQUIDITY_THRESHOLD: u64 = 500_000_000_000;

/// Minimum claim interval (1 hour)
pub const MIN_CLAIM_INTERVAL: i64 = 3600;

/// Seeds for PDA derivation
pub const STATE_SEED: &[u8] = b"mineball-state";
pub const HOLDER_SEED: &[u8] = b"holder";
pub const REWARD_POOL_SEED: &[u8] = b"reward-pool";
pub const BUYBACK_POOL_SEED: &[u8] = b"buyback-pool";
pub const LIQUIDITY_POOL_SEED: &[u8] = b"liquidity-pool";
