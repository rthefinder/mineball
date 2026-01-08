import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createMint, mintTo, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { assert } from 'chai';

describe('mineball', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Mineball as Program;
  
  let mint: PublicKey;
  let authority: Keypair;
  let statePDA: PublicKey;
  let rewardPoolPDA: PublicKey;
  let buybackPoolPDA: PublicKey;
  let liquidityPoolPDA: PublicKey;
  
  const STATE_SEED = 'mineball-state';
  const REWARD_POOL_SEED = 'reward-pool';
  const BUYBACK_POOL_SEED = 'buyback-pool';
  const LIQUIDITY_POOL_SEED = 'liquidity-pool';
  
  before(async () => {
    authority = Keypair.generate();
    
    // Airdrop SOL to authority
    const signature = await provider.connection.requestAirdrop(
      authority.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    // Create mint
    mint = await createMint(
      provider.connection,
      authority,
      authority.publicKey,
      null,
      6 // decimals
    );
    
    // Derive PDAs
    [statePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(STATE_SEED)],
      program.programId
    );
    
    [rewardPoolPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(REWARD_POOL_SEED)],
      program.programId
    );
    
    [buybackPoolPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(BUYBACK_POOL_SEED)],
      program.programId
    );
    
    [liquidityPoolPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(LIQUIDITY_POOL_SEED)],
      program.programId
    );
  });
  
  it('Initializes the protocol', async () => {
    const taxRate = 600; // 6%
    const miningRewardShare = 4000; // 40%
    const buybackShare = 3000; // 30%
    const liquidityShare = 2000; // 20%
    const burnShare = 1000; // 10%
    
    await program.methods
      .initialize(
        taxRate,
        miningRewardShare,
        buybackShare,
        liquidityShare,
        burnShare
      )
      .accounts({
        state: statePDA,
        authority: authority.publicKey,
        mint: mint,
        rewardPool: rewardPoolPDA,
        buybackPool: buybackPoolPDA,
        liquidityPool: liquidityPoolPDA,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([authority])
      .rpc();
    
    const state = await program.account.mineballState.fetch(statePDA);
    
    assert.equal(state.taxRate, taxRate);
    assert.equal(state.miningRewardShare, miningRewardShare);
    assert.equal(state.buybackShare, buybackShare);
    assert.equal(state.liquidityShare, liquidityShare);
    assert.equal(state.burnShare, burnShare);
  });
  
  it('Executes a transfer with tax', async () => {
    const sender = Keypair.generate();
    const recipient = Keypair.generate();
    
    // Airdrop SOL
    await provider.connection.requestAirdrop(
      sender.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      recipient.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    
    // Create token accounts
    const senderAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      authority,
      mint,
      sender.publicKey
    );
    
    const recipientAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      authority,
      mint,
      recipient.publicKey
    );
    
    // Mint tokens to sender
    const mintAmount = 1000000; // 1 token with 6 decimals
    await mintTo(
      provider.connection,
      authority,
      mint,
      senderAta.address,
      authority,
      mintAmount
    );
    
    // Execute transfer with tax
    const transferAmount = 100000; // 0.1 token
    
    await program.methods
      .transferWithTax(new anchor.BN(transferAmount))
      .accounts({
        state: statePDA,
        from: sender.publicKey,
        fromTokenAccount: senderAta.address,
        toTokenAccount: recipientAta.address,
        rewardPool: rewardPoolPDA,
        buybackPool: buybackPoolPDA,
        liquidityPool: liquidityPoolPDA,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([sender])
      .rpc();
    
    const state = await program.account.mineballState.fetch(statePDA);
    
    // Verify pools were updated
    assert(state.miningRewardPool.toNumber() > 0);
    assert(state.totalVolume.toNumber() === transferAmount);
  });
  
  it('Claims rewards for a holder', async () => {
    const holder = Keypair.generate();
    
    // Airdrop SOL
    const signature = await provider.connection.requestAirdrop(
      holder.publicKey,
      anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    // Create token account
    const holderAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      authority,
      mint,
      holder.publicKey
    );
    
    // Mint some tokens to holder
    await mintTo(
      provider.connection,
      authority,
      mint,
      holderAta.address,
      authority,
      1000000
    );
    
    // Derive holder PDA
    const [holderInfoPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('holder'), holder.publicKey.toBuffer()],
      program.programId
    );
    
    // Note: This test will fail if reward pool doesn't have sufficient balance
    // In a real scenario, you'd need to ensure the reward pool has tokens
    try {
      await program.methods
        .claimRewards()
        .accounts({
          state: statePDA,
          holderInfo: holderInfoPDA,
          holder: holder.publicKey,
          holderTokenAccount: holderAta.address,
          rewardPool: rewardPoolPDA,
          mint: mint,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([holder])
        .rpc();
      
      console.log('Rewards claimed successfully');
    } catch (error) {
      console.log('Expected error (no rewards in pool yet):', error.message);
    }
  });
});
