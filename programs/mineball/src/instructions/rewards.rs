use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use crate::{
    MineballState, HolderInfo, MineballError, RewardsDistributed, RewardsClaimed,
    constants::*,
};

#[derive(Accounts)]
pub struct DistributeRewards<'info> {
    #[account(
        mut,
        seeds = [STATE_SEED],
        bump = state.bump
    )]
    pub state: Account<'info, MineballState>,
    
    #[account(
        mut,
        seeds = [REWARD_POOL_SEED],
        bump
    )]
    pub reward_pool: Account<'info, TokenAccount>,
    
    pub mint: Account<'info, Mint>,
}

pub fn distribute_rewards(ctx: Context<DistributeRewards>) -> Result<()> {
    let state = &mut ctx.accounts.state;
    let clock = Clock::get()?;
    
    // Check if reward pool has reached threshold
    require!(
        state.mining_reward_pool >= state.reward_distribution_threshold,
        MineballError::RewardPoolBelowThreshold
    );
    
    let amount_to_distribute = state.mining_reward_pool;
    
    // Update state
    state.total_rewards_distributed = state.total_rewards_distributed
        .checked_add(amount_to_distribute)
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    state.mining_reward_pool = 0;
    state.last_reward_distribution = clock.unix_timestamp;
    state.total_mining_cycles = state.total_mining_cycles
        .checked_add(1)
        .ok_or(MineballError::ArithmeticOverflow)?;
    
    // Emit event
    emit!(RewardsDistributed {
        cycle: state.total_mining_cycles,
        amount: amount_to_distribute,
        recipients: 0, // Will be updated when individual claims happen
        timestamp: clock.unix_timestamp,
    });
    
    msg!("Rewards distributed: {} tokens", amount_to_distribute);
    msg!("Mining cycle: {}", state.total_mining_cycles);
    
    Ok(())
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(
        mut,
        seeds = [STATE_SEED],
        bump = state.bump
    )]
    pub state: Account<'info, MineballState>,
    
    #[account(
        init_if_needed,
        payer = holder,
        space = HolderInfo::LEN,
        seeds = [HOLDER_SEED, holder.key().as_ref()],
        bump
    )]
    pub holder_info: Account<'info, HolderInfo>,
    
    #[account(mut)]
    pub holder: Signer<'info>,
    
    #[account(mut)]
    pub holder_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [REWARD_POOL_SEED],
        bump
    )]
    pub reward_pool: Account<'info, TokenAccount>,
    
    pub mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    let holder_info = &mut ctx.accounts.holder_info;
    let state = &ctx.accounts.state;
    let clock = Clock::get()?;
    
    // Initialize holder info if needed
    if holder_info.holder == Pubkey::default() {
        holder_info.holder = ctx.accounts.holder.key();
        holder_info.total_rewards_earned = 0;
        holder_info.last_claim = 0;
        holder_info.pending_rewards = 0;
        holder_info.bump = ctx.bumps.holder_info;
    }
    
    // Check minimum claim interval
    require!(
        clock.unix_timestamp - holder_info.last_claim >= MIN_CLAIM_INTERVAL,
        MineballError::NoRewardsToClaim
    );
    
    // Calculate holder's share based on their balance
    let holder_balance = ctx.accounts.holder_token_account.amount;
    let total_supply = ctx.accounts.mint.supply;
    
    // Proportional share of reward pool
    let reward_amount = if total_supply > 0 {
        (ctx.accounts.reward_pool.amount as u128)
            .checked_mul(holder_balance as u128)
            .and_then(|v| v.checked_div(total_supply as u128))
            .and_then(|v| u64::try_from(v).ok())
            .ok_or(MineballError::ArithmeticOverflow)?
    } else {
        0
    };
    
    require!(reward_amount > 0, MineballError::NoRewardsToClaim);
    
    // Transfer rewards
    let state_seeds = &[STATE_SEED, &[state.bump]];
    let signer_seeds = &[&state_seeds[..]];
    
    let transfer_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.reward_pool.to_account_info(),
            to: ctx.accounts.holder_token_account.to_account_info(),
            authority: state.to_account_info(),
        },
        signer_seeds,
    );
    token::transfer(transfer_ctx, reward_amount)?;
    
    // Update holder info
    holder_info.total_rewards_earned = holder_info.total_rewards_earned
        .checked_add(reward_amount)
        .ok_or(MineballError::ArithmeticOverflow)?;
    holder_info.last_claim = clock.unix_timestamp;
    
    // Emit event
    emit!(RewardsClaimed {
        holder: ctx.accounts.holder.key(),
        amount: reward_amount,
        timestamp: clock.unix_timestamp,
    });
    
    msg!("Rewards claimed: {} tokens", reward_amount);
    
    Ok(())
}
