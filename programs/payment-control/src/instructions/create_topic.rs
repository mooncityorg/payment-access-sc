use anchor_lang::prelude::*;
use crate::{constants::*, state::*, error::*};
use anchor_spl::token::{ Mint, TokenAccount };

#[derive(Accounts)]
pub struct CreateTopic<'info> {
    #[account(mut)]
    pub publisher: Signer<'info>,

    #[account{
        seeds = [USER_ROLE_SEED.as_ref(), publisher.key().as_ref()],
        bump
    }]
    pub user_role: Box<Account<'info, UserRole>>,

    #[account(
        init,
        seeds = [TOPIC_INFO_SEED.as_ref(), publisher.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        space = 8 + TopicInfo::DATA_SIZE,
        payer = publisher
    )]
    pub topic_info: Box<Account<'info, TopicInfo>>,

    pub nft_mint: Box<Account<'info, Mint>>,

    pub cost_token_mint: Box<Account<'info, Mint>>,

    // #[account(mut)]
    // pub topic_owner: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_topic(ctx: Context<CreateTopic>, license_cost: u64) -> Result<()> {
    let accts = ctx.accounts;

    require!(accts.user_role.is_publisher.eq(&true), PaymentControlError::InvalidPublisher);

    accts.topic_info.owner = accts.publisher.key();
    accts.topic_info.nft_mint = accts.nft_mint.key();
    accts.topic_info.cost_token_mint = accts.cost_token_mint.key();
    accts.topic_info.license_cost = license_cost;
    accts.topic_info.subscription_count = 0;
    
    Ok(())
}