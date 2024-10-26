import { Program, Wallet, web3 } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import * as anchor from '@coral-xyz/anchor';
import { ComputeBudgetProgram, Connection, Keypair, Transaction, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { PROGRAM_ID } from '../lib/constants';
import { IDL } from '../target/types/payment';
import { addWhiteListIx, createInitializeIx, createTopicIx, getGlobalState, getLicenseInfoState, getTopicInfoState, getUserRoleInfoState, getWhiteListInfoState, initUserRoleIx, purchaseLicenseIx, removeWhiteListIx, revokeLicenseIx, transferGlobalAdminIx, updateTopicIx, updateUserRoleIx } from '../lib/scripts';

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

export const getUserRoleInfo = async (user: PublicKey) => {
    const userRoleInfoState = await getUserRoleInfoState(user, program);
    console.log('user role: ', userRoleInfoState);
}

export const getTopicInfo = async (publisher: PublicKey, nftMint: PublicKey) => {
    const topicInfo = await getTopicInfoState(publisher, nftMint, program);
    console.log('topic info: ', topicInfo);
}

export const getWhiteListInfo = async (publisher: PublicKey, subscriber: PublicKey) => {
    const whiteListInfo = await getWhiteListInfoState(publisher, subscriber, program);
    console.log('white list info: ', whiteListInfo);
}

export const getLicenseInfo = async (publisher: PublicKey, subscriber: PublicKey, nftMint: PublicKey) => {
    const licenseInfo = await getLicenseInfoState(publisher, subscriber, nftMint, program);
    console.log('license info: ', licenseInfo);
}

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

export const transferGlobalAdmin = async (newAdmin: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await transferGlobalAdminIx(payer.publicKey, newAdmin, program)
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

export const initUserRole = async () => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await initUserRoleIx(payer.publicKey, program)
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

export const updateUserRole = async (isPublisher: boolean, userAddress: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await updateUserRoleIx(payer.publicKey, userAddress, isPublisher, program)
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

export const createTopic = async (nftMint: PublicKey, costTokenMint: PublicKey, licenseCost: anchor.BN) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await createTopicIx(payer.publicKey, nftMint, costTokenMint, licenseCost, program)
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

export const updateTopic = async (nftMint: PublicKey, costTokenMint: PublicKey, licenseCost: anchor.BN) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await updateTopicIx(payer.publicKey, nftMint, costTokenMint, licenseCost, program)
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

export const addWhiteList = async (subscriber: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await addWhiteListIx(payer.publicKey, payer.publicKey, subscriber, program)
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

export const removeWhiteList = async (subscriber: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await removeWhiteListIx(payer.publicKey, payer.publicKey, subscriber, program)
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

export const purchaseLicense = async (publisher: PublicKey, nftMint: PublicKey, costTokenMint: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await purchaseLicenseIx(payer.publicKey, publisher, nftMint, costTokenMint, program)
        );
        const { blockhash } = await solConnection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = payer.publicKey;

        payer.signTransaction(tx);

        const txId = await provider.connection.sendTransaction(tx, [payer.payer], {
            preflightCommitment: 'confirmed',
            // skipPreflight: true,
        });

        console.log('txHash: ', `https://solana.fm/tx/${txId}?cluster=devnet-alpha`);
    } catch (e) {
        console.log(e);
    }
}

export const revokeLicense = async (publisher: PublicKey, nftMint: PublicKey) => {
    try {
        const tx = new Transaction().add(
            ...getGasIxs(),
            await revokeLicenseIx(payer.publicKey, publisher, nftMint, program)
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