use anchor_lang::prelude::*;
use crate::{ constants::*, state::*, error::* };
use anchor_spl::{ token::{ self, Mint, TokenAccount, Token, Transfer }, associated_token::AssociatedToken };

#[derive(Accounts)]
pub struct PurchaseLicense<'info> {
    #[account(mut)]
    pub subscriber: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [USER_ROLE_SEED.as_ref(), subscriber.key().as_ref()],
        bump,
        space = UserRole::DATA_SIZE,
        payer = subscriber
    )]
    pub subscriber_role: Box<Account<'info, UserRole>>,

    #[account(
        init_if_needed,
        seeds = [LICENSE_INFO_SEED.as_ref(), subscriber.key().as_ref(), topic_info.key().as_ref()],
        bump,
        space = LicenseInfo::DATA_SIZE,
        payer = subscriber
    )]
    pub license_info: Box<Account<'info, LicenseInfo>>,

    #[account(
        seeds = [TOPIC_INFO_SEED.as_ref(), publisher.key().as_ref(), nft_mint.key().as_ref()],
        bump
    )]
    pub topic_info: Box<Account<'info, TopicInfo>>,

    pub publisher: SystemAccount<'info>,

    #[account(
        init_if_needed,
        associated_token::mint = cost_token_mint,
        associated_token::authority = publisher,
        payer = subscriber
    )]
    pub publisher_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        associated_token::mint = cost_token_mint,
        associated_token::authority = subscriber,
    )]
    pub subscriber_token_account: Box<Account<'info, TokenAccount>>,

    pub nft_mint: Box<Account<'info, Mint>>,

    pub cost_token_mint: Box<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}

pub fn purchase_license(ctx: Context<PurchaseLicense>) -> Result<()> {
    let accts = ctx.accounts;

    require!(accts.subscriber_role.is_publisher.eq(&false), PaymentControlError::InvalidSubscriber);

    let token_program = accts.token_program.to_account_info();
    let cpi_accounts = Transfer {
        from: accts.subscriber_token_account.to_account_info(),
        to: accts.publisher_token_account.to_account_info(),
        authority: accts.subscriber.to_account_info(),
    };
    token::transfer(CpiContext::new(token_program.clone(), cpi_accounts), accts.topic_info.license_cost)?;

    accts.license_info.topic = accts.topic_info.key();
    accts.license_info.subscriber = accts.subscriber.key();
    accts.license_info.purchased = true;
    accts.license_info.purchased_at = Clock::get()?.unix_timestamp;

    Ok(())
}
