#!/usr/bin/env node

/**
 * Initialize the mineball protocol
 * 
 * Usage: node initialize.js [network]
 */

const anchor = require('@project-serum/anchor');
const { PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');
const path = require('path');

// Default configuration
const CONFIG = {
  taxRate: 600, // 6%
  miningRewardShare: 4000, // 40%
  buybackShare: 3000, // 30%
  liquidityShare: 2000, // 20%
  burnShare: 1000, // 10%
};

async function main() {
  const network = process.argv[2] || 'devnet';
  
  console.log(`🔧 Initializing mineball on ${network}...`);
  
  // Load wallet
  const walletPath = process.env.ANCHOR_WALLET || 
    path.join(process.env.HOME, '.config/solana/id.json');
  
  const walletKeypair = Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(walletPath, 'utf-8')))
  );
  
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
  
  // You need to provide your mint address here
  // For testing, you would create a new mint
  const mintAddress = new PublicKey('YOUR_MINT_ADDRESS_HERE');
  
  // Derive PDAs
  const [statePDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('mineball-state')],
    programId
  );
  
  const [rewardPoolPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('reward-pool')],
    programId
  );
  
  const [buybackPoolPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('buyback-pool')],
    programId
  );
  
  const [liquidityPoolPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('liquidity-pool')],
    programId
  );
  
  console.log('📍 PDAs:');
  console.log('  State:', statePDA.toString());
  console.log('  Reward Pool:', rewardPoolPDA.toString());
  console.log('  Buyback Pool:', buybackPoolPDA.toString());
  console.log('  Liquidity Pool:', liquidityPoolPDA.toString());
  
  // Initialize
  console.log('\n🚀 Initializing protocol...');
  
  const tx = await program.methods
    .initialize(
      CONFIG.taxRate,
      CONFIG.miningRewardShare,
      CONFIG.buybackShare,
      CONFIG.liquidityShare,
      CONFIG.burnShare
    )
    .accounts({
      state: statePDA,
      authority: walletKeypair.publicKey,
      mint: mintAddress,
      rewardPool: rewardPoolPDA,
      buybackPool: buybackPoolPDA,
      liquidityPool: liquidityPoolPDA,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  
  console.log('✅ Protocol initialized!');
  console.log('Transaction:', tx);
  
  // Fetch and display state
  const state = await program.account.mineballState.fetch(statePDA);
  console.log('\n📊 Protocol State:');
  console.log('  Tax Rate:', state.taxRate, 'bps');
  console.log('  Mining Reward Share:', state.miningRewardShare, 'bps');
  console.log('  Buyback Share:', state.buybackShare, 'bps');
  console.log('  Liquidity Share:', state.liquidityShare, 'bps');
  console.log('  Burn Share:', state.burnShare, 'bps');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
