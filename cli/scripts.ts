import { Program, Wallet, web3 } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import * as anchor from '@coral-xyz/anchor';
import { ComputeBudgetProgram, Connection, Keypair, Transaction, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { PROGRAM_ID } from '../lib/constants';
import { IDL } from '../target/types/uranus';
import { createInitializeIx, getGlobalState, mintNftIx, setFeeWalletIx, setPriceIx } from '../lib/scripts';

interface ISetConnectionParams {
    cluster: web3.Cluster; // env from CLI global params
    wallet: NodeWallet | Wallet; // needs to be both for TS & CLI differences
    rpc?: string;
}
let solConnection: Connection = null;
let program: Program = null;
let provider: anchor.Provider = null;
let payer: NodeWallet | Wallet = null;
let programId = new anchor.web3.PublicKey(PROGRAM_ID);

export const loadWalletFromKeypair = (keypair: string) => {
    console.log('Keypair Path:', keypair);
    const walletKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))),
        { skipValidation: true }
    );
    const wallet = new NodeWallet(walletKeypair);
    return wallet;
};

export const setConnection = async ({
    cluster,
    wallet,
    rpc,
}: ISetConnectionParams) => {
    console.log('Solana Cluster:', cluster);
    console.log('RPC URL:', rpc);

    if (!rpc) {
        solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
    } else {
        solConnection = new web3.Connection(rpc);
    }

    // Configure the client to use the local cluster.
    anchor.setProvider(
        new anchor.AnchorProvider(solConnection, wallet, {
            skipPreflight: true,
            commitment: 'confirmed',
        })
    );
    payer = wallet;

    provider = anchor.getProvider();
    console.log('Wallet Address: ', wallet.publicKey.toBase58());

    // Generate the program client from IDL.
    program = new anchor.Program(IDL as anchor.Idl, programId);
    console.log('ProgramId: ', program.programId.toBase58());
};

export const getGlobalInfo = async () => {
    const globalState = await getGlobalState(program);
    console.log('global state: ', globalState);
};

export const initProject = async () => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await createInitializeIx(payer.publicKey, program)
        );
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = payer.publicKey;

        payer.signTransaction(tx);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: 'confirmed',
        });

        console.log('txHash: ', `https://solana.fm/tx/${txId}?cluster=devnet-alpha`);
    } catch (e) {
        console.log(e);
    }
};

export const getGasIxs = () => {
    const updateCpIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.floor(5_000_000),
    });
    const updateCuIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: Math.floor(200_000),
    });
    return [updateCpIx, updateCuIx];
};

export const setPrice = async (price: anchor.BN) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await setPriceIx(payer.publicKey, price, program)
        );
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = payer.publicKey;

        payer.signTransaction(tx);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: 'confirmed',
        });

        console.log('txHash: ', `https://solana.fm/tx/${txId}?cluster=devnet-alpha`);
    } catch (e) {
        console.log(e);
    }
}

export const setFeeWallet = async (feeWallet: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await setFeeWalletIx(payer.publicKey, feeWallet, program)
        );
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = payer.publicKey;

        payer.signTransaction(tx);

        const txId = await provider.sendAndConfirm(tx, [], {
            commitment: 'confirmed',
        });

        console.log('txHash: ', `https://solana.fm/tx/${txId}?cluster=devnet-alpha`);
    } catch (e) {
        console.log(e);
    }
}

export const mintNft = async (rpc: string) => {
    try {
        const payload = await mintNftIx(payer.payer, rpc, program);
        const tx = new Transaction().add(
            ...getGasIxs(),
            payload.instruction
        );
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = payer.publicKey;

        payer.signTransaction(tx);

        const txId = await provider.sendAndConfirm(tx, [payload.signer], {
            commitment: 'confirmed',
            // skipPreflight: true
        });

        console.log('txHash: ', `https://solana.fm/tx/${txId}?cluster=devnet-alpha`);
    } catch (e) {
        console.log(e);
    }
}