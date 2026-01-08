# mineball ⛏️

> A mining-inspired flywheel meme coin on Solana

**Blocks are mined. Resources accumulate. Value compounds. The system grows block by block.**

mineball is a self-reinforcing tokenomics experiment where every transaction fuels an automated cycle of rewards, buybacks, and liquidity growth.

[![CI](https://github.com/rthefinder/mineball/workflows/CI/badge.svg)](https://github.com/rthefinder/mineball/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📖 Table of Contents

- [What is mineball?](#what-is-mineball)
- [How It Works](#how-it-works)
- [Features](#features)
- [Tokenomics](#tokenomics)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Documentation](#documentation)
- [Security](#security)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## 🎮 What is mineball?

mineball is a **meme experiment** inspired by sandbox mining games. It uses a deterministic, on-chain flywheel to create a self-sustaining economy:

- **Mining Activity**: Every transaction is "mining" — generating fees
- **Resource Accumulation**: Fees flow into protocol pools
- **Automated Triggers**: When pools reach thresholds, the flywheel activates
- **Compounding Growth**: More volume → More rewards → More growth

### The Narrative

Think of mining blocks in a sandbox game:
1. You mine a block → resources appear
2. Resources accumulate → you unlock new abilities
3. Those abilities help you mine faster → more resources
4. The cycle compounds → your "world" grows block by block

mineball brings this narrative to tokenomics:
- **Transactions = Mining**
- **Fees = Resources**
- **Pool Triggers = Unlocks**
- **Compounding = Growth**

### What mineball IS

✅ A deterministic flywheel system  
✅ A transparent reward mechanism  
✅ An automated protocol (no manual intervention)  
✅ A meme experiment  
✅ Built on Solana for speed and low fees  

### What mineball is NOT

❌ Financial advice  
❌ An investment product  
❌ Using copyrighted game assets  
❌ Promising profits  
❌ Controlled by admins after deployment  

---

## ⚙️ How It Works

### 1. Transaction Tax (6%)

Every mineball transfer applies a 6% tax, distributed as:

| Pool | Share | Purpose |
|------|-------|---------|
| **Mining Rewards** | 40% | Holder rewards |
| **Buyback Fund** | 30% | Token buybacks |
| **Liquidity Pool** | 20% | DEX liquidity |
| **Burn** | 10% | Supply reduction |

### 2. Pool Accumulation

Fees accumulate in separate pools:
- **Reward Pool**: Grows with each transaction
- **Buyback Pool**: Accumulates for market buys
- **Liquidity Pool**: Prepares for DEX additions

### 3. Automatic Triggers

When a pool reaches its threshold:

```
Reward Pool ≥ 1M tokens   → Distribute rewards to holders
Buyback Pool ≥ 500K tokens → Execute buyback from DEX
Liquidity Pool ≥ 500K tokens → Add liquidity to DEX
```

### 4. Mining Cycles

Each trigger completes a "mining cycle":
- Cycle counter increments
- Event emitted on-chain
- Dashboard updates in real-time
- The mineball grows stronger

### 5. The Flywheel

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
More Volume ← (Flywheel Completes)
```

---

## ✨ Features

### Smart Contract (Anchor/Rust)
- ✅ Fixed 6% tax on all transfers
- ✅ Automatic pool distribution (40/30/20/10 split)
- ✅ Holder reward tracking and claiming
- ✅ Deterministic buyback triggers
- ✅ Automated liquidity additions
- ✅ Burn mechanism (deflationary)
- ✅ Event emissions for transparency
- ✅ No mint authority (fixed supply)
- ✅ No admin controls (immutable)

### Dashboard (Next.js)
- 📊 Real-time protocol stats
- 💰 Pool balances and thresholds
- ⛏️ Mining cycle visualization
- 🔄 Flywheel health diagram
- 💎 Holder reward calculator
- 🔗 Wallet integration (Phantom, Solflare)
- 📈 Volume and distribution history

### Analytics Package
- 📉 Flywheel metrics calculation
- 📊 Protocol health scoring
- ⏱️ Next trigger estimation
- 💹 Holder rewards projection

---

## 💎 Tokenomics

**Token Details**
- Name: mineball
- Symbol: $mineball
- Blockchain: Solana
- Total Supply: 1,000,000,000 (1 billion)
- Decimals: 6
- Mint Authority: **Revoked**

**Tax Breakdown**
- Transaction Tax: **6%**
  - Mining Rewards: 40% (2.4% of tx)
  - Buyback Fund: 30% (1.8% of tx)
  - Liquidity: 20% (1.2% of tx)
  - Burn: 10% (0.6% of tx)

**Holder Rewards**
- Proportional to holdings
- Claimable anytime (1hr cooldown)
- No lockup required
- Transparent calculation

**For detailed tokenomics, see [docs/TOKENOMICS.md](docs/TOKENOMICS.md)**

---

## 📁 Repository Structure

```
mineball/
├── programs/
│   └── mineball/           # Anchor smart contract (Rust)
│       ├── src/
│       │   ├── lib.rs     # Program entry point
│       │   ├── state.rs   # State structures
│       │   ├── instructions/ # All instructions
│       │   ├── events.rs  # Event definitions
│       │   └── errors.rs  # Error codes
│       └── Cargo.toml
│
├── apps/
│   └── web/               # Next.js dashboard
│       ├── src/
│       │   ├── app/      # App router pages
│       │   └── components/ # React components
│       └── package.json
│
├── packages/
│   ├── shared/           # Shared types & utilities
│   │   └── src/
│   │       ├── types.ts  # TypeScript types
│   │       ├── constants.ts
│   │       └── utils.ts
│   │
│   └── analytics/        # Flywheel analytics
│       └── src/
│           ├── flywheel.ts # Flywheel metrics
│           └── metrics.ts  # Protocol metrics
│
├── tests/
│   └── mineball.test.ts  # Anchor tests
│
├── scripts/
│   ├── deploy.js         # Deployment script
│   ├── initialize.js     # Protocol initialization
│   └── simulate.js       # Flywheel simulation
│
├── docs/
│   ├── NARRATIVE.md      # Project narrative
│   ├── TOKENOMICS.md     # Detailed tokenomics
│   ├── TECHNICAL.md      # Technical documentation
│   └── SECURITY.md       # Security & threat model
│
├── .github/
│   └── workflows/        # CI/CD pipelines
│
├── Anchor.toml           # Anchor configuration
├── Cargo.toml            # Rust workspace
├── turbo.json            # Turborepo config
├── pnpm-workspace.yaml   # pnpm workspace
└── package.json          # Root package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 8+ (`npm install -g pnpm`)
- **Rust** 1.75+ ([Install](https://rustup.rs/))
- **Solana CLI** 1.17+ ([Install](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor** 0.29+ ([Install](https://www.anchor-lang.com/docs/installation))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/rthefinder/mineball.git
cd mineball

# Install all dependencies
pnpm install

# Build Anchor program
pnpm anchor:build

# Run tests
pnpm anchor:test

# Start local Solana validator (in separate terminal)
solana-test-validator

# Deploy to local network
anchor deploy --provider.cluster localnet

# Start the dashboard
cd apps/web
pnpm dev
```

Visit http://localhost:3000 to see the dashboard.

---

## 🛠️ Development

### Building the Smart Contract

```bash
# Build Anchor program
anchor build

# Run tests
anchor test

# Run tests with logs
anchor test -- --nocapture
```

### Running the Frontend

```bash
cd apps/web

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Simulating the Flywheel

```bash
cd scripts

# Run simulation
node simulate.js
```

This simulates 100 transactions and shows:
- Pool accumulation
- Trigger events
- Mining cycles
- Total distributions

### Linting and Type Checking

```bash
# Lint all packages
pnpm lint

# Type check TypeScript
cd apps/web && pnpm typecheck
cd packages/shared && pnpm typecheck
cd packages/analytics && pnpm typecheck
```

---

## 🌐 Deployment

### Deploy to Devnet

```bash
# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize protocol
node scripts/initialize.js devnet
```

### Deploy Frontend

```bash
cd apps/web

# Build
pnpm build

# Deploy to Vercel (or your hosting platform)
vercel deploy --prod
```

### Environment Variables

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_MINEBALL_PROGRAM_ID=<YOUR_PROGRAM_ID>
```

### Deploy to Mainnet

⚠️ **WARNING**: Mainnet deployment is permanent and irreversible.

**Before mainnet deployment:**
1. ✅ Complete security audit
2. ✅ Test extensively on devnet
3. ✅ Review all code
4. ✅ Verify no mint authority
5. ✅ Verify all admin functions
6. ✅ Test with real users on devnet

```bash
# Build verifiable program
anchor build --verifiable

# Deploy (IRREVERSIBLE)
anchor deploy --provider.cluster mainnet-beta

# Initialize (IRREVERSIBLE)
node scripts/initialize.js mainnet-beta
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all Anchor tests
anchor test

# Run with verbose output
anchor test -- --nocapture
```

### Test Coverage

Tests cover:
- ✅ Protocol initialization
- ✅ Transfer with tax calculation
- ✅ Pool accumulation
- ✅ Reward distribution
- ✅ Holder reward claims
- ✅ Edge cases (overflow, underflow)
- ✅ Error conditions

### Integration Testing

```bash
# Start local validator
solana-test-validator

# Deploy locally
anchor deploy --provider.cluster localnet

# Run integration tests
# (Add your integration test commands here)
```

---

## 📚 Documentation

Comprehensive documentation is available in `/docs`:

- **[NARRATIVE.md](docs/NARRATIVE.md)** - Project story and philosophy
- **[TOKENOMICS.md](docs/TOKENOMICS.md)** - Detailed token economics
- **[TECHNICAL.md](docs/TECHNICAL.md)** - Technical documentation
- **[SECURITY.md](docs/SECURITY.md)** - Security model and threats

### Key Concepts

**Mining Cycle**: A complete loop of accumulation → trigger → distribution

**Flywheel**: The self-reinforcing cycle where more activity creates more rewards, which creates more activity

**PDAs**: Program Derived Addresses used for secure pool storage

**Tax Routing**: Automatic distribution of transaction fees to protocol pools

---

## 🔒 Security

mineball is designed with security first:

- ✅ **No mint authority** (supply is fixed)
- ✅ **No upgrade authority** (immutable after deployment)
- ✅ **No admin controls** (fully automated)
- ✅ **Overflow protection** (all arithmetic checked)
- ✅ **Transparent operations** (events for all actions)
- ✅ **Audit-ready code** (extensively commented)

### Security Checklist

- [x] Internal code review
- [ ] External security audit ⏳ (REQUIRED before mainnet)
- [ ] Penetration testing ⏳
- [ ] Fuzzing ⏳
- [ ] Bug bounty program ⏳

**⚠️ DO NOT deploy to mainnet without professional security audit ⚠️**

See [docs/SECURITY.md](docs/SECURITY.md) for the complete threat model.

---

## ⚠️ Disclaimer

**mineball is an experimental meme coin. This is NOT financial advice.**

- ❌ No profit guarantees
- ❌ No price promises
- ❌ No refunds
- ❌ Extreme volatility
- ❌ Potential total loss

**Key Points:**
- This is a meme experiment for entertainment
- You can lose 100% of your investment
- Do your own research
- Only invest what you can afford to lose
- Not responsible for financial losses
- No warranties of any kind

By using mineball, you acknowledge:
1. You understand the risks
2. You are not relying on any promises
3. You take full responsibility for your actions
4. You will not hold developers liable for losses

**Trade responsibly. Have fun. Mine blocks. Grow the ball. 🎱⛏️**

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

This is a meme experiment. The code is open for learning purposes.

If you find bugs or have suggestions:
1. Open an issue
2. Describe the problem/suggestion
3. Include steps to reproduce (for bugs)

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 🔗 Links

- **Documentation**: [/docs](docs/)
- **Program ID**: `Mine11111111111111111111111111111111111111` (update after deployment)
- **Dashboard**: (add URL after deployment)
- **Solana Explorer**: (add link after deployment)

---

## 📊 Stats

- **Language**: Rust, TypeScript
- **Framework**: Anchor, Next.js
- **Blockchain**: Solana
- **Lines of Code**: ~5,000+
- **Test Coverage**: Comprehensive

---

## 🎯 Roadmap

### Phase 1: MVP ✅
- ✅ Core smart contract
- ✅ Basic dashboard
- ✅ Testing suite
- ✅ Documentation

### Phase 2: Devnet Launch
- ⏳ Security audit
- ⏳ Devnet deployment
- ⏳ Community testing
- ⏳ Bug fixes

### Phase 3: Mainnet
- ⏳ Final audit
- ⏳ Mainnet deployment
- ⏳ Liquidity provision
- ⏳ Marketing launch

### Future Considerations
- Advanced analytics
- Mobile app
- DAO governance
- Multi-DEX support

---

## 🙏 Acknowledgments

Built with:
- [Solana](https://solana.com)
- [Anchor](https://www.anchor-lang.com)
- [Next.js](https://nextjs.org)
- [Turborepo](https://turbo.build)

Inspired by:
- Sandbox mining games
- Flywheel tokenomics
- DeFi 2.0 mechanics
- Meme coin culture

---

## ❓ FAQ

**Q: Is this a scam?**  
A: No. The code is open source, auditable, and has no backdoors. But it IS a meme experiment — don't invest more than you can lose.

**Q: Can the developers drain funds?**  
A: No. There are no withdrawal functions. All funds are controlled by the program logic.

**Q: How do I claim rewards?**  
A: Connect your wallet to the dashboard and click "Claim Rewards" when available.

**Q: What happens if I hold for a long time?**  
A: You earn proportional rewards from every mining cycle. The longer you hold (and the more volume), the more rewards accumulate.

**Q: Can the tax rate change?**  
A: No. It's fixed at 6% in the smart contract and cannot be changed.

**Q: Where do buybacks come from?**  
A: The buyback pool accumulates 30% of all taxes. When it reaches 500K tokens, it executes a buyback automatically.

**Q: Is there a max supply?**  
A: Yes. 1 billion tokens. No mint authority = supply can only decrease (via burns).

---

<div align="center">

**⛏️ Mine blocks. Accumulate resources. Compound value. Grow the ball. ⛏️**

Built with ❤️ on Solana

</div>
