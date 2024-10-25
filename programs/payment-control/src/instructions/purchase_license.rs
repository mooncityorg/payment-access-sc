use anchor_lang::prelude::*;
use crate::{constants::*, state::*, error::*};
use anchor_spl::token::TokenAccount;

#[derive(Accounts)]
pub struct PurchaseLicense<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [USER_ROLE_SEED.as_ref(), user.key().as_ref()],
        bump,
        space = UserRole::DATA_SIZE,
        payer = user
    )]
    pub user_role: Box<Account<'info, UserRole>>,

    #[account(
        init_if_needed,
        seeds = [LICENSE_INFO_SEED.as_ref(), user.key().as_ref(), topic.key().as_ref()],
        bump,
        space = LicenseInfo::DATA_SIZE,
        payer = user
    )]
    pub license_info: Box<Account<'info, LicenseInfo>>,

    #[account(mut)]
    pub topic: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn purchase_license(ctx: Context<PurchaseLicense>) -> Result<()> {
    let accts = ctx.accounts;
    
    require!(accts.user_role.is_publisher.eq(&false), PaymentControlError::InvalidSubscriber);

    accts.license_info.topic = accts.topic.key();
    accts.license_info.subscriber = accts.user.key();
    accts.license_info.purchased = true;
    accts.license_info.purchased_at = Clock::get()?.unix_timestamp;

    Ok(())
}