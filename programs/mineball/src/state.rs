use anchor_lang::prelude::*;

/// Global state for the mineball protocol
#[account]
pub struct MineballState {
    /// Authority that can perform admin functions (renounced after setup)
    pub authority: Pubkey,
    
    /// Mint address of the mineball token
    pub mint: Pubkey,
    
    /// Total supply of tokens
    pub total_supply: u64,
    
    /// Tax rate in basis points (e.g., 600 = 6%)
    pub tax_rate: u16,
    
    /// Tax distribution shares (in basis points, must sum to 10000)
    pub mining_reward_share: u16,
    pub buyback_share: u16,
    pub liquidity_share: u16,
    pub burn_share: u16,
    
    /// Pool balances
    pub mining_reward_pool: u64,
    pub buyback_pool: u64,
    pub liquidity_pool: u64,
    pub total_burned: u64,
    
    /// Mining cycle tracking
    pub total_mining_cycles: u64,
    pub total_volume: u64,
    pub total_rewards_distributed: u64,
    pub total_buyback_executed: u64,
    pub total_liquidity_added: u64,
    
    /// Thresholds for automatic triggers
    pub reward_distribution_threshold: u64,
    pub buyback_threshold: u64,
    pub liquidity_threshold: u64,
    
    /// Timestamps
    pub created_at: i64,
    pub last_reward_distribution: i64,
    pub last_buyback: i64,
    pub last_liquidity_add: i64,
    
    /// Bump seeds
    pub bump: u8,
}

impl MineballState {
    pub const LEN: usize = 8 + // discriminator
        32 + // authority
        32 + // mint
        8 + // total_supply
        2 + // tax_rate
        2 + 2 + 2 + 2 + // shares
        8 + 8 + 8 + 8 + // pool balances
        8 + 8 + 8 + 8 + 8 + // cycle tracking
        8 + 8 + 8 + // thresholds
        8 + 8 + 8 + 8 + // timestamps
        1 + // bump
        128; // padding
}

/// Holder info for reward tracking
#[account]
pub struct HolderInfo {
    /// Holder's wallet address
    pub holder: Pubkey,
    
    /// Total rewards earned
    pub total_rewards_earned: u64,
    
    /// Last claim timestamp
    pub last_claim: i64,
    
    /// Pending rewards
    pub pending_rewards: u64,
    
    /// Bump seed
    pub bump: u8,
}

impl HolderInfo {
    pub const LEN: usize = 8 + // discriminator
        32 + // holder
        8 + // total_rewards_earned
        8 + // last_claim
        8 + // pending_rewards
        1 + // bump
        64; // padding
}
