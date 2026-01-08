use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount};
use crate::{MineballState, MineballError, LiquidityAdded, constants::*};

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(
        mut,
        seeds = [STATE_SEED],
        bump = state.bump
    )]
    pub state: Account<'info, MineballState>,
    
    #[account(
        mut,
        seeds = [LIQUIDITY_POOL_SEED],
        bump
    )]
    pub liquidity_pool: Account<'info, TokenAccount>,
    
    /// The account that will add liquidity (usually authority or automated bot)
    pub executor: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn add_liquidity(ctx: Context<AddLiquidity>) -> Result<()> {
    let state = &mut ctx.accounts.state;
    let clock = Clock::get()?;
    
    // Check if liquidity pool has reached threshold
    require!(
        state.liquidity_pool >= state.liquidity_threshold,
        MineballError::LiquidityPoolBelowThreshold
    );
    
    let liquidity_amount = state.liquidity_pool;
    
    // In a real implementation, this would:
    // 1. Take tokens from the liquidity pool
    // 2. Add them to the DEX liquidity pool (e.g., Raydium)
    // 3. Receive LP tokens
    //
    // For this MVP, we simulate the execution
    // You would integrate with Raydium/Orca here
    
    // Update state
    state.total_liquidity_added = state.total_liquidity_added
        .checked_add(liquidity_amount)
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    state.liquidity_pool = 0;
    state.last_liquidity_add = clock.unix_timestamp;
    
    // Emit event
    emit!(LiquidityAdded {
        cycle: state.total_mining_cycles,
        amount: liquidity_amount,
        timestamp: clock.unix_timestamp,
    });
    
    msg!("Liquidity added: {} tokens", liquidity_amount);
    
    Ok(())
}
