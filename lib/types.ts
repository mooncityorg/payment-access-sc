import { PublicKey } from "@solana/web3.js";
import * as anchor from '@coral-xyz/anchor';

export interface GlobalState {
    admin: PublicKey, // global SC admin authority
    total_topics_count: anchor.BN, // total created topics count for statistics
}

export interface UserRole {
    address: PublicKey, // publisher or subscriber address
    is_publisher: boolean, // true for publishers and false for subscribers
}

export interface TopicInfo {
    owner: PublicKey, // created publisher address
    nft_mint: PublicKey, // mint of license NFT for this topic
    cost_token_mint: PublicKey, // spl mint should cost to purchase license
    license_cost: anchor.BN, // license price amount
    subscription_count: anchor.BN, // license purchased count for this topic
}

export interface WhiteListInfo {
    publisher: PublicKey, // publisher address
    subscriber: PublicKey, // subscriber address to allow connect with this publisher
    allowed: boolean, // true - allowed, default - false
}

export interface LicenseInfo {
    topic: PublicKey, // topic PDA address
    subscriber: PublicKey, // subscriber address
    purchased: boolean, // purchased status
    purchased_at: anchor.BN, // purchased timestamp
}