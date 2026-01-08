# Local Development Infrastructure

This directory contains tooling for local development and testing.

## Tools

### setup.sh

Automated setup script that:
- Checks prerequisites
- Installs dependencies
- Builds the Anchor program
- Runs tests

Usage:
```bash
chmod +x setup.sh
./setup.sh
```

## Local Validator

To run a local Solana validator:

```bash
# Start validator
solana-test-validator

# In another terminal, check status
solana cluster-version

# Check balance
solana balance

# Airdrop SOL for testing
solana airdrop 10
```

## Resetting State

To reset your local blockchain state:

```bash
# Stop the validator
# Delete test ledger
rm -rf test-ledger/

# Start fresh
solana-test-validator --reset
```

## RPC Configuration

Default local RPC:
- URL: http://127.0.0.1:8899
- WebSocket: ws://127.0.0.1:8900

Configure Solana CLI:
```bash
solana config set --url localhost
```

## Useful Commands

```bash
# Check config
solana config get

# View program logs
solana logs

# Get program account info
solana account <PROGRAM_ID>

# List programs
solana program show <PROGRAM_ID>
```

## Troubleshooting

### Port Already in Use

If port 8899 is in use:
```bash
lsof -i :8899
kill -9 <PID>
```

### Out of SOL

Airdrop more:
```bash
solana airdrop 10
```

### Program Deployment Failed

1. Check validator is running
2. Check balance (need ~5 SOL)
3. Rebuild: `anchor build`
4. Try again: `anchor deploy`

## Docker Setup (Optional)

For containerized development:

```dockerfile
# Coming soon - Docker Compose setup for:
# - Solana validator
# - Next.js frontend
# - All dependencies
```
