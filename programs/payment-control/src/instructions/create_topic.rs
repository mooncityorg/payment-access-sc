use anchor_lang::prelude::*;
use crate::{constants::*, state::*, error::*};
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct CreateTopic<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account{
        init,
        seeds = [USER_ROLE_SEED.as_ref(), user.key().as_ref()],
        bump,
        space = UserRole::DATA_SIZE,
        payer = user
    }]
    pub user_role: Box<Account<'info, UserRole>>,

    #[account(
        init,
        seeds = [TOPIC_INFO_SEED.as_ref(), topic_owner.key().as_ref(), token_mint.key().as_ref()],
        bump,
        space = TopicInfo::DATA_SIZE,
        payer = user
    )]
    pub topic_info: Box<Account<'info, TopicInfo>>,

    #[account(mut)]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub topic_owner: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_topic(ctx: Context<CreateTopic>, cost_token_mint: Pubkey, license_cost: u64) -> Result<()> {
    let accts = ctx.accounts;

    require!(accts.user_role.is_publisher.eq(&true), PaymentControlError::InvalidPublisher);

    accts.topic_info.owner = accts.topic_owner.key();
    accts.topic_info.nft_mint = accts.token_mint.key();
    accts.topic_info.cost_token_mint = cost_token_mint;
    accts.topic_info.license_cost = license_cost;
    accts.topic_info.subscription_count = 0;
    
    Ok(())
}