use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::{MineballState, MineballError, constants::*, errors::*};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = MineballState::LEN,
        seeds = [STATE_SEED],
        bump
    )]
    pub state: Account<'info, MineballState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = state,
        seeds = [REWARD_POOL_SEED],
        bump
    )]
    pub reward_pool: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = state,
        seeds = [BUYBACK_POOL_SEED],
        bump
    )]
    pub buyback_pool: Account<'info, TokenAccount>,
    
    #[account(
        init,
        payer = authority,
        token::mint = mint,
        token::authority = state,
        seeds = [LIQUIDITY_POOL_SEED],
        bump
    )]
    pub liquidity_pool: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn initialize(
    ctx: Context<Initialize>,
    tax_rate: u16,
    mining_reward_share: u16,
    buyback_share: u16,
    liquidity_share: u16,
    burn_share: u16,
) -> Result<()> {
    // Validate tax rate
    require!(tax_rate <= MAX_TAX_RATE, MineballError::InvalidTaxRate);
    
    // Validate that shares sum to 100%
    let total_shares = mining_reward_share
        .checked_add(buyback_share)
        .and_then(|s| s.checked_add(liquidity_share))
        .and_then(|s| s.checked_add(burn_share))
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    require!(total_shares == BASIS_POINTS, MineballError::InvalidTaxShares);
    
    let state = &mut ctx.accounts.state;
    let clock = Clock::get()?;
    
    state.authority = ctx.accounts.authority.key();
    state.mint = ctx.accounts.mint.key();
    state.total_supply = ctx.accounts.mint.supply;
    state.tax_rate = tax_rate;
    state.mining_reward_share = mining_reward_share;
    state.buyback_share = buyback_share;
    state.liquidity_share = liquidity_share;
    state.burn_share = burn_share;
    
    // Initialize pools to zero
    state.mining_reward_pool = 0;
    state.buyback_pool = 0;
    state.liquidity_pool = 0;
    state.total_burned = 0;
    
    // Initialize cycle tracking
    state.total_mining_cycles = 0;
    state.total_volume = 0;
    state.total_rewards_distributed = 0;
    state.total_buyback_executed = 0;
    state.total_liquidity_added = 0;
    
    // Set thresholds
    state.reward_distribution_threshold = DEFAULT_REWARD_THRESHOLD;
    state.buyback_threshold = DEFAULT_BUYBACK_THRESHOLD;
    state.liquidity_threshold = DEFAULT_LIQUIDITY_THRESHOLD;
    
    // Set timestamps
    state.created_at = clock.unix_timestamp;
    state.last_reward_distribution = clock.unix_timestamp;
    state.last_buyback = clock.unix_timestamp;
    state.last_liquidity_add = clock.unix_timestamp;
    
    state.bump = ctx.bumps.state;
    
    msg!("mineball protocol initialized");
    msg!("Tax rate: {}bps", tax_rate);
    msg!("Mining reward share: {}bps", mining_reward_share);
    msg!("Buyback share: {}bps", buyback_share);
    msg!("Liquidity share: {}bps", liquidity_share);
    msg!("Burn share: {}bps", burn_share);
    
    Ok(())
}
