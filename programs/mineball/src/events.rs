use anchor_lang::prelude::*;

/// Emitted when mining rewards are distributed
#[event]
pub struct RewardsDistributed {
    pub cycle: u64,
    pub amount: u64,
    pub recipients: u64,
    pub timestamp: i64,
}

/// Emitted when a buyback is executed
#[event]
pub struct BuybackExecuted {
    pub cycle: u64,
    pub amount: u64,
    pub tokens_bought: u64,
    pub timestamp: i64,
}

/// Emitted when liquidity is added
#[event]
pub struct LiquidityAdded {
    pub cycle: u64,
    pub amount: u64,
    pub timestamp: i64,
}

/// Emitted when a mining cycle completes
#[event]
pub struct MiningCycleCompleted {
    pub cycle: u64,
    pub total_volume: u64,
    pub rewards_distributed: u64,
    pub buyback_executed: u64,
    pub liquidity_added: u64,
    pub timestamp: i64,
}

/// Emitted on each taxed transfer
#[event]
pub struct TransferWithTaxExecuted {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub tax_amount: u64,
    pub timestamp: i64,
}

/// Emitted when a holder claims rewards
#[event]
pub struct RewardsClaimed {
    pub holder: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
}
