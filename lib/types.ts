import { PublicKey } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';

export interface GlobalState  {
    vault: PublicKey,
    owner: PublicKey,
    feeWallet: PublicKey,
    price: anchor.BN
}