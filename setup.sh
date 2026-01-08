#!/bin/bash

# mineball Local Development Setup Script

set -e

echo "🎱 mineball Local Development Setup"
echo "===================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm not found. Installing..."
    npm install -g pnpm
fi
echo "✅ pnpm $(pnpm --version)"

# Check Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ Rust not found. Please install from https://rustup.rs/"
    exit 1
fi
echo "✅ Rust $(rustc --version)"

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install from https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi
echo "✅ Solana $(solana --version)"

# Check Anchor
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor not found. Please install from https://www.anchor-lang.com/docs/installation"
    exit 1
fi
echo "✅ Anchor $(anchor --version)"

echo ""
echo "Installing dependencies..."
pnpm install

echo ""
echo "Building Anchor program..."
anchor build

echo ""
echo "Running tests..."
anchor test

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start a local validator in a new terminal:"
echo "   solana-test-validator"
echo ""
echo "2. Deploy the program locally:"
echo "   anchor deploy --provider.cluster localnet"
echo ""
echo "3. Start the dashboard:"
echo "   cd apps/web && pnpm dev"
echo ""
echo "4. Visit http://localhost:3000"
echo ""
echo "⛏️ Happy mining!"
