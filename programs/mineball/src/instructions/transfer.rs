use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::{MineballState, MineballError, TransferWithTaxExecuted, constants::*};

#[derive(Accounts)]
pub struct TransferWithTax<'info> {
    #[account(
        mut,
        seeds = [STATE_SEED],
        bump = state.bump
    )]
    pub state: Account<'info, MineballState>,
    
    #[account(mut)]
    pub from: Signer<'info>,
    
    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [REWARD_POOL_SEED],
        bump
    )]
    pub reward_pool: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [BUYBACK_POOL_SEED],
        bump
    )]
    pub buyback_pool: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [LIQUIDITY_POOL_SEED],
        bump
    )]
    pub liquidity_pool: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

pub fn transfer_with_tax(ctx: Context<TransferWithTax>, amount: u64) -> Result<()> {
    require!(amount > 0, MineballError::InvalidAmount);
    
    let state = &mut ctx.accounts.state;
    let clock = Clock::get()?;
    
    // Calculate tax
    let tax_amount = (amount as u128)
        .checked_mul(state.tax_rate as u128)
        .and_then(|v| v.checked_div(BASIS_POINTS as u128))
        .and_then(|v| u64::try_from(v).ok())
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    let net_amount = amount
        .checked_sub(tax_amount)
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    // Calculate tax distribution
    let mining_reward_amount = (tax_amount as u128)
        .checked_mul(state.mining_reward_share as u128)
        .and_then(|v| v.checked_div(BASIS_POINTS as u128))
        .and_then(|v| u64::try_from(v).ok())
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    let buyback_amount = (tax_amount as u128)
        .checked_mul(state.buyback_share as u128)
        .and_then(|v| v.checked_div(BASIS_POINTS as u128))
        .and_then(|v| u64::try_from(v).ok())
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    let liquidity_amount = (tax_amount as u128)
        .checked_mul(state.liquidity_share as u128)
        .and_then(|v| v.checked_div(BASIS_POINTS as u128))
        .and_then(|v| u64::try_from(v).ok())
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    // Burn amount (remaining after other distributions)
    let burn_amount = tax_amount
        .checked_sub(mining_reward_amount)
        .and_then(|v| v.checked_sub(buyback_amount))
        .and_then(|v| v.checked_sub(liquidity_amount))
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    // Transfer net amount to recipient
    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.from.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, net_amount)?;
    
    // Transfer mining rewards to pool
    if mining_reward_amount > 0 {
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.reward_pool.to_account_info(),
                authority: ctx.accounts.from.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, mining_reward_amount)?;
        state.mining_reward_pool = state.mining_reward_pool
            .checked_add(mining_reward_amount)
            .ok_or(MineballError::ArithmeticOverflow)?;
    }
    
    // Transfer to buyback pool
    if buyback_amount > 0 {
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.buyback_pool.to_account_info(),
                authority: ctx.accounts.from.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, buyback_amount)?;
        state.buyback_pool = state.buyback_pool
            .checked_add(buyback_amount)
            .ok_or(MineballError::ArithmeticOverflow)?;
    }
    
    // Transfer to liquidity pool
    if liquidity_amount > 0 {
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.from_token_account.to_account_info(),
                to: ctx.accounts.liquidity_pool.to_account_info(),
                authority: ctx.accounts.from.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, liquidity_amount)?;
        state.liquidity_pool = state.liquidity_pool
            .checked_add(liquidity_amount)
            .ok_or(MineballError::ArithmeticOverflow)?;
    }
    
    // Track burn (tokens are left in from_account and effectively removed from circulation)
    if burn_amount > 0 {
        state.total_burned = state.total_burned
            .checked_add(burn_amount)
            .ok_or(MineballError::ArithmeticOverflow)?;
    }
    
    // Update total volume
    state.total_volume = state.total_volume
        .checked_add(amount)
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    // Emit event
    emit!(TransferWithTaxExecuted {
        from: ctx.accounts.from.key(),
        to: ctx.accounts.to_token_account.owner,
        amount,
        tax_amount,
        timestamp: clock.unix_timestamp,
    });
    
    Ok(())
}
