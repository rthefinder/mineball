# Security & Threat Model

## Security Principles

mineball is designed with the following security principles:

1. **Immutability**: No upgrades, no changes after deployment
2. **Transparency**: All logic on-chain, fully auditable
3. **Determinism**: Same inputs always produce same outputs
4. **No Backdoors**: No admin controls, no emergency stops
5. **Decentralization**: No single point of failure

## Threat Model

### Threat 1: Smart Contract Bugs

**Risk**: High  
**Impact**: Critical

**Description**: Bugs in the Rust smart contract code could lead to:
- Incorrect tax calculations
- Pool balance corruption
- Reward distribution errors
- Loss of funds

**Mitigations**:
- ✅ Extensive unit tests
- ✅ Integration tests
- ✅ Overflow checks on all arithmetic
- ✅ Anchor framework safety features
- 🔲 External security audit (recommended before mainnet)
- 🔲 Formal verification (optional)
- 🔲 Bug bounty program

### Threat 2: Reentrancy Attacks

**Risk**: Low  
**Impact**: High

**Description**: Attacker calls back into contract before state updates.

**Mitigations**:
- ✅ Anchor's account validation
- ✅ State updates before external calls
- ✅ PDA ownership checks
- ✅ No recursive calls in contract

### Threat 3: Arithmetic Overflow/Underflow

**Risk**: Medium  
**Impact**: Critical

**Description**: Integer overflow could corrupt balances.

**Mitigations**:
- ✅ Rust's overflow checks in release mode
- ✅ Explicit `checked_*` operations
- ✅ Tests for edge cases
- ✅ Reasonable bounds on all values

### Threat 4: Unauthorized Access

**Risk**: Low  
**Impact**: High

**Description**: Attacker gains unauthorized access to restricted functions.

**Mitigations**:
- ✅ Signer checks on all sensitive operations
- ✅ PDA-based authority
- ✅ Account ownership validation
- ✅ No "master key" that can be stolen

### Threat 5: Front-Running

**Risk**: Medium  
**Impact**: Medium

**Description**: MEV bots front-run large transactions.

**Mitigations**:
- 🔲 Slippage protection (user-side)
- 🔲 Private RPC endpoints (user choice)
- ⚠️ Inherent to DEX trading

**Note**: This is a general DeFi risk, not specific to mineball.

### Threat 6: Flash Loan Attacks

**Risk**: Low  
**Impact**: Medium

**Description**: Attacker uses flash loan to manipulate rewards.

**Mitigations**:
- ✅ Minimum claim interval (1 hour)
- ✅ Rewards based on sustained holdings
- ✅ No single-block manipulable values

### Threat 7: Oracle Manipulation

**Risk**: N/A  
**Impact**: N/A

**Description**: mineball doesn't use price oracles.

**Mitigations**:
- ✅ No external oracle dependency
- ✅ All calculations based on on-chain state

### Threat 8: Centralization Risk

**Risk**: Low (by design)  
**Impact**: High (if present)

**Description**: Single party controls protocol.

**Mitigations**:
- ✅ No admin keys after deployment
- ✅ No upgrade authority
- ✅ No pause mechanism
- ✅ Deterministic execution only
- ✅ Mint authority revoked

### Threat 9: DEX Integration Risk

**Risk**: Medium  
**Impact**: High

**Description**: Buyback/liquidity functions depend on external DEX.

**Mitigations**:
- ✅ Well-audited DEX protocols (Raydium/Orca)
- ✅ Fallback mechanisms (pools can accumulate)
- 🔲 Multiple DEX support (future)
- ⚠️ Inherent third-party risk

### Threat 10: Economic Attacks

**Risk**: Medium  
**Impact**: Medium

**Description**: Attacker manipulates tokenomics for profit.

**Scenarios**:
- **Wash Trading**: Large volume to trigger cycles
  - Mitigation: Tax makes this expensive
- **Pool Draining**: Claim all rewards
  - Mitigation: Rewards proportional to holdings
- **Sybil Attack**: Many wallets to game rewards
  - Mitigation: No advantage; rewards based on total holdings

### Threat 11: Rugpull Risk

**Risk**: None (by design)  
**Impact**: N/A

**Description**: Developer drains funds.

**Mitigations**:
- ✅ No mint authority
- ✅ No admin withdrawal functions
- ✅ No backdoors in code
- ✅ All funds locked in PDAs controlled by program
- ✅ LP tokens held by protocol (can't be withdrawn)

### Threat 12: Social Engineering

**Risk**: Medium  
**Impact**: High (user-level)

**Description**: Attacker tricks users into:
- Sending tokens to wrong address
- Signing malicious transactions
- Visiting phishing sites

**Mitigations**:
- ✅ Clear documentation
- ✅ Official website only
- ✅ Transaction preview before signing
- 🔲 Domain verification
- 🔲 Official social media accounts

### Threat 13: Network-Level Attacks

**Risk**: Low  
**Impact**: Medium

**Description**: Attacks on Solana network itself.

**Scenarios**:
- Network congestion
- Validator collusion
- Network halt

**Mitigations**:
- ⚠️ Relies on Solana security model
- ✅ No special vulnerability beyond normal Solana apps

## Risk Assessment Matrix

| Threat | Likelihood | Impact | Risk Level | Status |
|--------|-----------|--------|------------|--------|
| Contract Bugs | Medium | Critical | **HIGH** | Needs audit |
| Reentrancy | Low | High | Medium | Mitigated |
| Arithmetic Overflow | Low | Critical | Medium | Mitigated |
| Unauthorized Access | Low | High | Medium | Mitigated |
| Front-Running | Medium | Medium | Medium | User responsibility |
| Flash Loans | Low | Medium | Low | Mitigated |
| Oracle Issues | N/A | N/A | N/A | Not applicable |
| Centralization | Low | High | Low | Mitigated |
| DEX Integration | Medium | High | **HIGH** | Requires careful integration |
| Economic Attacks | Medium | Medium | Medium | Monitoring needed |
| Rugpull | None | N/A | None | Impossible by design |
| Social Engineering | Medium | High | Medium | User education |
| Network Attacks | Low | Medium | Low | Solana-dependent |

## Security Checklist

### Pre-Deployment

- [ ] Complete internal code review
- [ ] External security audit
- [ ] Fuzz testing
- [ ] Test on devnet for extended period
- [ ] Verify no mint authority
- [ ] Verify no upgrade authority
- [ ] Verify all admin functions are restricted
- [ ] Test emergency scenarios
- [ ] Verify all event emissions
- [ ] Check arithmetic overflow cases
- [ ] Verify PDA derivations
- [ ] Test with various wallet implementations

### Post-Deployment

- [ ] Verify deployed program matches audited code
- [ ] Renounce any remaining authorities
- [ ] Monitor transactions in first 24 hours
- [ ] Set up alerting for anomalies
- [ ] Monitor pool balances
- [ ] Track event emissions
- [ ] Verify DEX integrations working
- [ ] Document contract address publicly
- [ ] Create verification guide for users

## Incident Response

If a critical vulnerability is discovered:

1. **Assess Impact**: Determine severity and affected users
2. **No Kill Switch**: Protocol cannot be paused (by design)
3. **Public Disclosure**: Announce issue immediately
4. **User Warning**: Advise users to stop trading
5. **Analysis**: Publish detailed post-mortem
6. **Future Versions**: Learn for v2 (separate deployment)

**Note**: Immutability means bugs cannot be patched. This is intentional to prevent backdoors, but means security must be perfect before deployment.

## Reporting Vulnerabilities

If you discover a security vulnerability:

1. **Do NOT** exploit it
2. **Do NOT** publicly disclose before team is notified
3. Contact: [Add contact method]
4. Provide:
   - Detailed description
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

Responsible disclosure is appreciated.

## Audit Status

- **Internal Review**: ✅ Completed
- **External Audit**: 🔲 Not yet (REQUIRED before mainnet)
- **Audit Firm**: TBD
- **Audit Report**: Not available yet

**⚠️ DO NOT DEPLOY TO MAINNET WITHOUT PROFESSIONAL AUDIT ⚠️**

## Security Assumptions

mineball security relies on:

1. **Solana Network Security**: Validators are honest, network is live
2. **Rust Compiler**: No compiler bugs
3. **Anchor Framework**: Framework is secure
4. **SPL Token Program**: Token program is secure
5. **DEX Protocols**: Raydium/Orca are secure
6. **Wallet Software**: Users use secure wallets

## Disclaimer

Despite best efforts, **no software is bug-free**. Blockchain deployments are permanent and irreversible. Users interact with mineball at their own risk.

**This is a meme experiment. Expect bugs. Expect losses. Do not invest more than you can afford to lose.**

---

Security is a continuous process. This document will be updated as new threats are identified and mitigated.

Last Updated: 2026-01-08
