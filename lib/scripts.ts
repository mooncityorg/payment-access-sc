import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';
import { GLOBAL_STATE_SEED, VAULT_SEED } from "./constants";
import { GlobalState } from "./types";
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { findMasterEditionPda, findMetadataPda, MPL_TOKEN_METADATA_PROGRAM_ID, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { publicKey } from "@metaplex-foundation/umi";

export const createInitializeIx = async (
    owner: PublicKey,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);
    const vault = findVaultPda(program.programId);
    const ix = await program.methods
        .initialize()
        .accounts({
            owner,
            globalState,
            vault,
            systemProgram: SystemProgram.programId
        })
        .instruction();

    return ix;
}

export const mintNftIx = async (
    owner: Keypair,
    endPoint: string,
    program: anchor.Program
) => {
    const globalData = await getGlobalState(program);
    const mintAddress = anchor.web3.Keypair.generate();
    const nftTokenAccount = await getAssociatedTokenAddress(
        mintAddress.publicKey,
        owner.publicKey
    );

    const umi = createUmi(endPoint)
        .use(walletAdapterIdentity(owner))
        .use(mplTokenMetadata());

    // derive the metedata account
    const metadataAccount = findMetadataPda(umi, {
        mint: publicKey(mintAddress.publicKey)
    })[0];

    // derive the master edition pda
    const masterEditionAccount = findMasterEditionPda(umi, {
        mint: publicKey(mintAddress.publicKey)
    })[0];

    const metadata = {
        name: "Basic Uranus",
        symbol: "Uranus",
        uri: "https://raw.githubusercontent.com/687c/solana-nft-native-client/main/metadata.json",
    };

    const rentSysvar = anchor.web3.SYSVAR_RENT_PUBKEY;

    const ix = await program.methods
        .mintNft(
        metadata.name,
        metadata.symbol,
        metadata.uri)
        .accounts({
            user: owner.publicKey,
            globalState: globalData.key,
            vault: globalData.data.vault,
            feeWallet: globalData.data.feeWallet,
            nftMint: mintAddress.publicKey,
            userNftTokenAccount: nftTokenAccount,
            nftMetadataAccount: metadataAccount,
            nftMasterEditionAccount: masterEditionAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            rent: rentSysvar
        })
        .instruction();

    return {instruction: ix, signer: mintAddress};
}

export const setPriceIx = async (
    owner: PublicKey,
    price: anchor.BN,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);

    const ix = await program.methods
        .setPrice(price)
        .accounts({
            owner,
            globalState
        })
        .instruction();

    return ix;
}

export const setFeeWalletIx = async (
    owner: PublicKey,
    feeWallet: PublicKey,
    program: anchor.Program
) => {
    const globalState = findGlobalStatePda(program.programId);

    const ix = await program.methods
        .setFeeWallet(feeWallet)
        .accounts({
            owner,
            globalState
        })
        .instruction();

    return ix;
}

export const findGlobalStatePda = (programId: PublicKey) => {
    const [globalState] = PublicKey.findProgramAddressSync(
        [Buffer.from(GLOBAL_STATE_SEED)],
        programId
    );
    return globalState;
}

export const getGlobalState = async (program: anchor.Program) => {
    const globalState = findGlobalStatePda(program.programId);
    const globalPoolData = await program.account.globalState.fetch(globalState);

    return {
        key: globalState,
        data: globalPoolData as unknown as GlobalState,
    };
};

export const findVaultPda = (programId: PublicKey) => {
    const [vault] = PublicKey.findProgramAddressSync(
        [Buffer.from(VAULT_SEED)],
        programId
    )
    return vault;
}