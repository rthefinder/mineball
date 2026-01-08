# mineball Tokenomics

## Token Details

- **Name**: mineball
- **Symbol**: $mineball
- **Blockchain**: Solana
- **Total Supply**: 1,000,000,000 (1 billion)
- **Decimals**: 6
- **Mint Authority**: Revoked after deployment
- **Freeze Authority**: None

## Tax Structure

### Transaction Tax: 6%

Every mineball transfer (buy/sell/transfer) incurs a 6% tax, distributed as follows:

| Pool | Share | Purpose |
|------|-------|---------|
| **Mining Rewards** | 40% (2.4% of tx) | Distributed to holders |
| **Buyback Fund** | 30% (1.8% of tx) | Used to buy back tokens |
| **Liquidity Pool** | 20% (1.2% of tx) | Added to DEX liquidity |
| **Burn** | 10% (0.6% of tx) | Permanently removed from supply |

### Why 6%?

- High enough to fuel the flywheel
- Low enough to not deter trading
- Competitive with other meme coins
- Balanced across all pools

## Flywheel Mechanism

### Pool Thresholds

Each pool accumulates taxes until reaching a threshold:

| Pool | Threshold | Action When Triggered |
|------|-----------|----------------------|
| Mining Rewards | 1,000,000 tokens | Distribute proportionally to holders |
| Buyback Fund | 500,000 tokens | Execute buyback from DEX |
| Liquidity Pool | 500,000 tokens | Add paired liquidity to DEX |

### Mining Cycle

A "mining cycle" completes when one or more pools trigger. Each cycle:

1. **Accumulation Phase**
   - Transactions occur
   - Taxes flow into pools
   - Pools grow toward thresholds

2. **Trigger Phase**
   - Pool reaches threshold
   - Automatic action executes
   - Event emitted on-chain

3. **Compounding Phase**
   - New rewards available for claiming
   - More liquidity = better price stability
   - Buybacks reduce circulating supply
   - Burns permanently reduce total supply

4. **Repeat**
   - Cycle counter increments
   - Process begins again

## Holder Rewards

### How Rewards Work

- Rewards accumulate in the Mining Rewards Pool
- When the pool reaches 1M tokens, distribution becomes available
- Holders can claim their proportional share at any time
- Rewards are based on % of circulating supply held

### Claiming Rewards

- **Claim Interval**: Minimum 1 hour between claims
- **Calculation**: `(Your Balance / Total Supply) × Reward Pool`
- **Gas**: Minimal (Solana transaction fees)
- **Frequency**: Claim as often as you want (after cooldown)

### Example

If you hold 1% of total supply and the reward pool has 2M tokens ready for distribution:
- Your share: `0.01 × 2,000,000 = 20,000 tokens`
- You can claim 20,000 tokens

## Buyback Mechanism

### How Buybacks Work

1. Buyback fund accumulates from tax
2. When fund reaches 500K tokens threshold:
   - Fund is swapped for SOL on DEX
   - SOL is used to buy mineball tokens
   - Bought tokens are either burned or added to liquidity
   - This creates buy pressure and reduces supply

### Impact

- **Buy Pressure**: Automatic buying from the market
- **Price Support**: Consistent demand from the protocol itself
- **Supply Reduction**: Bought tokens leave circulation

## Liquidity Management

### How Liquidity Grows

1. Liquidity pool accumulates from tax
2. When pool reaches 500K tokens threshold:
   - Tokens are paired with SOL
   - Pair is added to DEX liquidity pool
   - LP tokens are held by the protocol (locked)

### Impact

- **Deeper Liquidity**: More tokens can trade with less slippage
- **Price Stability**: Larger liquidity = less volatility
- **Trading Confidence**: Better experience for traders

## Burn Mechanism

### How Burning Works

- 10% of every tax is permanently burned
- Burns happen on every transaction
- Burned tokens are removed from total supply
- No way to recover burned tokens

### Impact

- **Supply Reduction**: Total supply decreases over time
- **Scarcity**: Remaining tokens become relatively more scarce
- **Deflationary**: Unlike inflationary tokens, supply only goes down

## Economic Model

### Supply Dynamics

```
Starting Supply: 1,000,000,000
- Burns (over time): Variable
- Buybacks (removed): Variable
= Circulating Supply: Decreasing
```

### Value Accrual

Value flows to holders through:
1. **Direct Rewards**: 40% of all taxes → claimable rewards
2. **Buyback Support**: 30% of taxes → buy pressure
3. **Liquidity Depth**: 20% of taxes → trading stability
4. **Scarcity**: 10% of taxes → supply reduction

### Growth Formula

```
More Volume
  ↓
More Fees Collected
  ↓
Larger Pools
  ↓
More Rewards + Buybacks + Liquidity
  ↓
More Holders + Better Trading
  ↓
More Volume (Flywheel Completes)
```

## Security & Immutability

### What Cannot Change

- ✅ Tax rate (fixed at 6%)
- ✅ Pool shares (40/30/20/10 split)
- ✅ Thresholds (though could be updated via governance if implemented)
- ✅ Total supply (no mint authority)
- ✅ Core logic (immutable smart contract)

### What Can Be Verified

All of the following are verifiable on-chain:
- Tax collection and distribution
- Pool balances
- Reward calculations
- Buyback executions
- Liquidity additions
- Burn amounts
- Mining cycle count

## Transparency

### On-Chain Events

Every action emits an event:
- `TransferWithTaxExecuted` - Each taxed transfer
- `RewardsDistributed` - When rewards distribute
- `BuybackExecuted` - When buyback happens
- `LiquidityAdded` - When liquidity grows
- `MiningCycleCompleted` - Each completed cycle
- `RewardsClaimed` - When holder claims

### Audit Trail

100% of protocol activity is on-chain and publicly auditable via:
- Solana Explorer
- Program logs
- Account state
- Transaction history

## Risk Factors

### Protocol Risks

1. **Smart Contract Risk**: Bugs in contract code
2. **DEX Risk**: Dependence on external DEX protocols
3. **Liquidity Risk**: Initial liquidity must be added
4. **Market Risk**: Token price can still go to zero

### Holder Risks

1. **No Profit Guarantee**: This is a meme experiment
2. **High Volatility**: Meme coins are extremely volatile
3. **Potential Loss**: You can lose 100% of your investment
4. **No Recourse**: No refunds, no customer support

## Disclaimer

**mineball is a meme experiment. Not financial advice.**

- Do your own research
- Only invest what you can afford to lose
- Understand the risks
- This is entertainment, not an investment product
- Past performance (of other meme coins) does not indicate future results
- The developers make no promises about price or returns

---

**Summary**: mineball uses a 6% tax to fuel a self-reinforcing flywheel of rewards, buybacks, liquidity, and burns. The system is deterministic, transparent, and designed to compound over time. It's a meme experiment—trade responsibly.
