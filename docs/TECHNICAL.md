# mineball Technical Documentation

## Architecture Overview

mineball is built as a monorepo with the following structure:

```
mineball/
├── programs/mineball/    # Anchor smart contract (Rust)
├── apps/web/             # Next.js dashboard (TypeScript)
├── packages/
│   ├── shared/          # Shared types and utilities
│   └── analytics/       # Metrics and flywheel calculations
├── tests/               # Contract test suite
├── scripts/             # Deployment and simulation scripts
└── docs/                # Documentation
```

## Smart Contract

### Program ID

```
Mine11111111111111111111111111111111111111
```

(Update after deployment)

### State Accounts

#### MineballState

The global protocol state:

```rust
pub struct MineballState {
    pub authority: Pubkey,
    pub mint: Pubkey,
    pub total_supply: u64,
    pub tax_rate: u16,
    pub mining_reward_share: u16,
    pub buyback_share: u16,
    pub liquidity_share: u16,
    pub burn_share: u16,
    pub mining_reward_pool: u64,
    pub buyback_pool: u64,
    pub liquidity_pool: u64,
    pub total_burned: u64,
    pub total_mining_cycles: u64,
    pub total_volume: u64,
    // ... additional fields
}
```

#### HolderInfo

Per-holder reward tracking:

```rust
pub struct HolderInfo {
    pub holder: Pubkey,
    pub total_rewards_earned: u64,
    pub last_claim: i64,
    pub pending_rewards: u64,
    pub bump: u8,
}
```

### Instructions

#### initialize

Initializes the protocol with tax configuration.

**Accounts:**
- `state` - MineballState PDA (created)
- `authority` - Protocol authority
- `mint` - Token mint
- `reward_pool` - Reward pool token account (created)
- `buyback_pool` - Buyback pool token account (created)
- `liquidity_pool` - Liquidity pool token account (created)

**Parameters:**
- `tax_rate: u16` - Tax in basis points (max 1000)
- `mining_reward_share: u16` - % of tax for rewards (in bps)
- `buyback_share: u16` - % of tax for buybacks (in bps)
- `liquidity_share: u16` - % of tax for liquidity (in bps)
- `burn_share: u16` - % of tax for burns (in bps)

**Validation:**
- Tax rate ≤ 1000 bps (10%)
- Shares sum to 10000 bps (100%)

#### transfer_with_tax

Executes a token transfer with automatic tax routing.

**Accounts:**
- `state` - MineballState PDA
- `from` - Sender (signer)
- `from_token_account` - Sender's token account
- `to_token_account` - Recipient's token account
- `reward_pool` - Reward pool token account
- `buyback_pool` - Buyback pool token account
- `liquidity_pool` - Liquidity pool token account

**Parameters:**
- `amount: u64` - Transfer amount (before tax)

**Logic:**
1. Calculate tax: `tax = amount × tax_rate / 10000`
2. Calculate net: `net = amount - tax`
3. Split tax across pools based on shares
4. Transfer net to recipient
5. Transfer each pool share
6. Update state volumes
7. Emit event

#### distribute_rewards

Distributes accumulated rewards (called when threshold reached).

**Accounts:**
- `state` - MineballState PDA
- `reward_pool` - Reward pool token account
- `mint` - Token mint (for supply data)

**Logic:**
1. Check pool ≥ threshold
2. Mark rewards as distributed
3. Reset pool to 0
4. Increment mining cycle
5. Emit event

**Note**: Individual holders must call `claim_rewards` to receive their share.

#### claim_rewards

Allows a holder to claim their proportional rewards.

**Accounts:**
- `state` - MineballState PDA
- `holder_info` - HolderInfo PDA (created if needed)
- `holder` - Holder wallet (signer)
- `holder_token_account` - Holder's token account
- `reward_pool` - Reward pool token account
- `mint` - Token mint

**Logic:**
1. Calculate holder's share: `share = (holder_balance / total_supply) × pool_balance`
2. Check min claim interval (1 hour)
3. Transfer share to holder
4. Update holder info
5. Emit event

#### execute_buyback

Executes a buyback using accumulated funds (MVP: simulation).

**Accounts:**
- `state` - MineballState PDA
- `buyback_pool` - Buyback pool token account
- `executor` - Executor account (signer)

**Logic:**
1. Check pool ≥ threshold
2. Execute buyback (integrate with DEX in production)
3. Update state
4. Emit event

#### add_liquidity

Adds liquidity from accumulated pool (MVP: simulation).

**Accounts:**
- `state` - MineballState PDA
- `liquidity_pool` - Liquidity pool token account
- `executor` - Executor account (signer)

**Logic:**
1. Check pool ≥ threshold
2. Add liquidity (integrate with DEX in production)
3. Update state
4. Emit event

### Events

All protocol actions emit events for transparency:

```rust
#[event]
pub struct TransferWithTaxExecuted {
    pub from: Pubkey,
    pub to: Pubkey,
    pub amount: u64,
    pub tax_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct RewardsDistributed {
    pub cycle: u64,
    pub amount: u64,
    pub recipients: u64,
    pub timestamp: i64,
}

// ... additional events
```

### PDAs (Program Derived Addresses)

All protocol accounts use PDAs for security:

```typescript
// State PDA
[b"mineball-state"]

// Holder Info PDA
[b"holder", holder_pubkey]

// Pool PDAs
[b"reward-pool"]
[b"buyback-pool"]
[b"liquidity-pool"]
```

## Frontend Integration

### Connecting to the Program

```typescript
import { AnchorProvider, Program } from '@project-serum/anchor';
import { Connection } from '@solana/web3.js';
import idl from './idl/mineball.json';

const connection = new Connection('https://api.devnet.solana.com');
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(idl, programId, provider);
```

### Fetching Protocol State

```typescript
import { deriveStatePDA } from '@mineball/shared';

const [statePDA] = deriveStatePDA();
const state = await program.account.mineballState.fetch(statePDA);

console.log('Total Volume:', state.totalVolume.toString());
console.log('Mining Cycles:', state.totalMiningCycles.toString());
console.log('Reward Pool:', state.miningRewardPool.toString());
```

### Claiming Rewards

```typescript
import { deriveHolderPDA, deriveRewardPoolPDA } from '@mineball/shared';

const [holderPDA] = deriveHolderPDA(wallet.publicKey);
const [rewardPoolPDA] = deriveRewardPoolPDA();

await program.methods
  .claimRewards()
  .accounts({
    state: statePDA,
    holderInfo: holderPDA,
    holder: wallet.publicKey,
    holderTokenAccount: holderAta,
    rewardPool: rewardPoolPDA,
    mint: mintAddress,
    // ...
  })
  .rpc();
```

### Listening to Events

```typescript
program.addEventListener('RewardsDistributed', (event) => {
  console.log('Rewards distributed:', event.amount.toString());
  console.log('Mining cycle:', event.cycle.toString());
});
```

## Development

### Prerequisites

- Node.js 18+
- Rust 1.75+
- Solana CLI 1.17+
- Anchor CLI 0.29+
- pnpm 8+

### Local Setup

```bash
# Install dependencies
pnpm install

# Build Anchor program
pnpm anchor:build

# Run tests
pnpm anchor:test

# Start local validator (separate terminal)
solana-test-validator

# Deploy locally
anchor deploy --provider.cluster localnet
```

### Running the Frontend

```bash
cd apps/web
pnpm dev
```

Visit http://localhost:3000

### Running Simulations

```bash
cd scripts
node simulate.js
```

## Testing

### Unit Tests

Comprehensive test suite in `/tests`:

```bash
anchor test
```

Tests cover:
- ✅ Protocol initialization
- ✅ Transfer with tax
- ✅ Pool accumulation
- ✅ Reward distribution
- ✅ Reward claims
- ✅ Edge cases and errors

### Simulation Testing

Flywheel simulation script:

```bash
node scripts/simulate.js
```

Simulates 100 transactions and shows:
- Pool accumulation
- Trigger events
- Mining cycles
- Total distributions

## Deployment

### Devnet Deployment

```bash
# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Update program ID in configs
# Then initialize
node scripts/initialize.js devnet
```

### Mainnet Deployment

**⚠️ WARNING**: Mainnet deployment is permanent and irreversible.

```bash
# Thorough audit first!
# Build with mainnet config
anchor build --verifiable

# Deploy
anchor deploy --provider.cluster mainnet-beta

# Initialize (IRREVERSIBLE)
node scripts/initialize.js mainnet-beta
```

## Security Considerations

### Audits

- [ ] Internal code review
- [ ] External security audit
- [ ] Penetration testing
- [ ] Formal verification (optional)

### Known Limitations

1. **DEX Integration**: MVP uses simulated buyback/liquidity. Production needs Raydium/Orca integration.
2. **Oracle Risk**: No price oracle; relies on DEX state.
3. **Front-Running**: Large transactions could be front-run.
4. **Threshold Timing**: Triggers are not time-based, only volume-based.

### Best Practices

- ✅ No mint authority after deployment
- ✅ No freeze authority
- ✅ No blacklist mechanism
- ✅ No admin withdrawal functions
- ✅ All state changes through deterministic logic
- ✅ Events for all critical actions
- ✅ Overflow checks on all arithmetic

## Monitoring

### On-Chain Metrics

Monitor via Solana Explorer:
- Program logs
- Account state changes
- Event emissions
- Transaction history

### Dashboard Metrics

The web dashboard displays:
- Real-time pool balances
- Mining cycle count
- Total volume
- Rewards distributed
- Burn rate
- Flywheel health

## API Reference

Full API docs are generated from IDL:

```bash
anchor idl parse -f programs/mineball/src/lib.rs
```

## Contributing

This is a meme experiment. Contributions are not expected, but the code is open for learning purposes.

## Support

- Documentation: `/docs`
- Issues: GitHub Issues (if repository is public)
- Community: (Add Discord/Telegram if applicable)

---

Built with ⛏️ on Solana
