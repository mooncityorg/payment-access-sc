pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
use instructions::*;
pub use state::*;

declare_id!("H7mLLoUULceT1iL7XzsYZZCP6Ax7mWQoRDudJLruKkq2");

#[program]
pub mod payment {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn transfer_global_admin(ctx: Context<TransferGlobalAdmin>, new_admin: Pubkey) -> Result<()> {
        instructions::transfer_global_admin(ctx, new_admin)
    }

    pub fn init_user_role(ctx: Context<InitUserRole>) -> Result<()> {
        instructions::init_user_role(ctx)
    }

    pub fn update_user_role(ctx: Context<UpdateUserRole>, is_publisher: bool) -> Result<()> {
        instructions::update_user_role(ctx, is_publisher)
    }

    pub fn create_topic(ctx: Context<CreateTopic>, cost_token_mint: Pubkey, license_cost: u64) -> Result<()> {
        instructions::create_topic(ctx, cost_token_mint, license_cost)
    }

    pub fn update_topic(ctx: Context<UpdateTopic>, license_cost: u64) -> Result<()> {
        instructions::update_topic(ctx, license_cost)
    }

    pub fn add_white_list(ctx: Context<AddWhiteList>) -> Result<()> {
        instructions::add_white_list(ctx)
    }

    pub fn remove_white_list(ctx: Context<RemoveWhiteList>) -> Result<()> {
        instructions::remove_white_list(ctx)
    }

    pub fn purchase_license(ctx: Context<PurchaseLicense>) -> Result<()> {
        instructions::purchase_license(ctx)
    }

    pub fn revoke_license(ctx: Context<RevokeLicense>) -> Result<()> {
        instructions::revoke_license(ctx)
    }
}
