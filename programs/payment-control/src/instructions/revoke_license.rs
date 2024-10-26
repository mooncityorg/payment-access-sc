use anchor_lang::prelude::*;
use crate::{constants::*, state::*, error::*};
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct RevokeLicense<'info> {
    #[account(mut)]
    pub publisher: Signer<'info>,

    pub subscriber: SystemAccount<'info>,

    #[account(
        seeds = [USER_ROLE_SEED.as_ref(), publisher.key().as_ref()],
        bump
    )]
    pub publisher_role: Box<Account<'info, UserRole>>,

    #[account(
        seeds = [LICENSE_INFO_SEED.as_ref(), subscriber.key().as_ref(), topic_info.key().as_ref()],
        bump
    )]
    pub license_info: Box<Account<'info, LicenseInfo>>,

    #[account(
        seeds = [TOPIC_INFO_SEED.as_ref(), publisher.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub topic_info: Box<Account<'info, TopicInfo>>,

    pub nft_mint: Box<Account<'info, Mint>>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

}

pub fn revoke_license(ctx: Context<RevokeLicense>) -> Result<()> {
    let accts = ctx.accounts;

    require!(accts.publisher_role.is_publisher.eq(&true), PaymentControlError::InvalidPublisher);

    accts.license_info.purchased = false;

    Ok(())
}