#!/usr/bin/env node

/**
 * Deploy script for mineball protocol
 * 
 * Usage: node deploy.js [network]
 * network: localnet | devnet | mainnet-beta
 */

const anchor = require('@project-serum/anchor');
const { PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

async function main() {
  const network = process.argv[2] || 'devnet';
  
  console.log(`🚀 Deploying mineball to ${network}...`);
  
  // Load wallet
  const walletPath = process.env.ANCHOR_WALLET || 
    path.join(process.env.HOME, '.config/solana/id.json');
  
  if (!fs.existsSync(walletPath)) {
    throw new Error(`Wallet not found at ${walletPath}`);
  }
  
  const walletKeypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(walletPath, 'utf-8')))
  );
  
  console.log(`📝 Deployer: ${walletKeypair.publicKey.toString()}`);
  
  // Configure provider
  const connection = new anchor.web3.Connection(
    anchor.web3.clusterApiUrl(network),
    'confirmed'
  );
  
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  
  anchor.setProvider(provider);
  
  // Load program
  const programId = new PublicKey('Mine11111111111111111111111111111111111111');
  const idlPath = path.join(__dirname, '../target/idl/mineball.json');
  const idl = JSON.parse(fs.readFileSync(idlPath, 'utf-8'));
  
  const program = new anchor.Program(idl, programId, provider);
  
  console.log(`📦 Program ID: ${programId.toString()}`);
  
  // Check balance
  const balance = await connection.getBalance(walletKeypair.publicKey);
  console.log(`💰 Balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  
  if (balance < 0.1 * anchor.web3.LAMPORTS_PER_SOL) {
    throw new Error('Insufficient balance. Need at least 0.1 SOL');
  }
  
  console.log('✅ Deployment preparation complete!');
  console.log('\nNext steps:');
  console.log('1. Deploy the program: anchor deploy --provider.cluster', network);
  console.log('2. Update program ID in Anchor.toml');
  console.log('3. Run: node scripts/initialize.js', network);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
