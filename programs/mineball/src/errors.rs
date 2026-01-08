use anchor_lang::prelude::*;

#[error_code]
pub enum MineballError {
    #[msg("Invalid tax rate (must be between 0 and 1000 basis points)")]
    InvalidTaxRate,
    
    #[msg("Tax shares do not sum to 10000 basis points")]
    InvalidTaxShares,
    
    #[msg("Insufficient balance for transfer")]
    InsufficientBalance,
    
    #[msg("Reward pool below distribution threshold")]
    RewardPoolBelowThreshold,
    
    #[msg("Buyback pool below execution threshold")]
    BuybackPoolBelowThreshold,
    
    #[msg("Liquidity pool below addition threshold")]
    LiquidityPoolBelowThreshold,
    
    #[msg("No rewards available to claim")]
    NoRewardsToClaim,
    
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    
    #[msg("Unauthorized")]
    Unauthorized,
    
    #[msg("Invalid amount")]
    InvalidAmount,
}
