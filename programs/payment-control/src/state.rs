use anchor_lang::prelude::*;

#[account]
pub struct GlobalState {
    pub admin: Pubkey, // global SC admin authority
    pub total_topics_count: u64, // total created topics count for statistics
}

impl GlobalState {
    pub const DATA_SIZE: usize = 8 + std::mem::size_of::<GlobalState>();
}

#[account]
pub struct UserRole {
    pub address: Pubkey, // publisher or subscriber address
    pub is_publisher: bool, // true for publishers and false for subscribers
}

impl UserRole {
    pub const DATA_SIZE: usize = 8 + std::mem::size_of::<UserRole>();
}

#[account]
pub struct TopicInfo {
    pub owner: Pubkey, // created publisher address
    pub nft_mint: Pubkey, // mint of license NFT for this topic
    pub cost_token_mint: Pubkey, // spl mint should cost to purchase license
    pub license_cost: u64, // license price amount
    pub subscription_count: u64, // license purchased count for this topic
}

impl TopicInfo {
    pub const DATA_SIZE: usize = 8 + std::mem::size_of::<TopicInfo>();
}

#[account]
pub struct WhiteListInfo {
    pub publisher: Pubkey, // publisher address
    pub subscriber: Pubkey, // subscriber address to allow connect with this publisher
    pub allowed: bool, // true - allowed, default - false
}

impl WhiteListInfo {
    pub const DATA_SIZE: usize = 8 + std::mem::size_of::<WhiteListInfo>();
}

#[account]
pub struct LicenseInfo {
    pub topic: Pubkey, // topic PDA address
    pub subscriber: Pubkey, // subscriber address
    pub purchased: bool, // purchased status
    pub purchased_at: i64, // purchased timestamp
}

impl LicenseInfo {
    pub const DATA_SIZE: usize = 8 + std::mem::size_of::<LicenseInfo>();
}