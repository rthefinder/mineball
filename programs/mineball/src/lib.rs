use anchor_lang::prelude::*;

declare_id!("Mine11111111111111111111111111111111111111");

pub mod state;
pub mod instructions;
pub mod errors;
pub mod events;
pub mod constants;

pub use state::*;
pub use instructions::*;
pub use errors::*;
pub use events::*;
pub use constants::*;

#[program]
pub mod mineball {
    use super::*;

    /// Initialize the mineball protocol
    /// Sets up the global state and mining pools
    pub fn initialize(
        ctx: Context<Initialize>,
        tax_rate: u16,
        mining_reward_share: u16,
        buyback_share: u16,
        liquidity_share: u16,
        burn_share: u16,
    ) -> Result<()> {
        instructions::initialize(
            ctx,
            tax_rate,
            mining_reward_share,
            buyback_share,
            liquidity_share,
            burn_share,
        )
    }

    /// Process a transfer with tax
    /// Applies the tax split and routes funds to respective pools
    pub fn transfer_with_tax(
        ctx: Context<TransferWithTax>,
        amount: u64,
    ) -> Result<()> {
        instructions::transfer_with_tax(ctx, amount)
    }

    /// Distribute mining rewards to holders
    /// Called when the reward pool reaches threshold
    pub fn distribute_rewards(ctx: Context<DistributeRewards>) -> Result<()> {
        instructions::distribute_rewards(ctx)
    }

    /// Execute buyback from accumulated pool
    /// Triggered when buyback pool reaches threshold
    pub fn execute_buyback(ctx: Context<ExecuteBuyback>) -> Result<()> {
        instructions::execute_buyback(ctx)
    }

    /// Add liquidity from accumulated pool
    /// Triggered when liquidity pool reaches threshold
    pub fn add_liquidity(ctx: Context<AddLiquidity>) -> Result<()> {
        instructions::add_liquidity(ctx)
    }

    /// Claim mining rewards as a holder
    pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
        instructions::claim_rewards(ctx)
    }
}
