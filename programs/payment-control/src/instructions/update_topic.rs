use anchor_lang::prelude::*;
use crate::{ constants::*, state::*, error::* };
use anchor_spl::token::{ Mint, TokenAccount };

#[derive(Accounts)]
pub struct UpdateTopic<'info> {
    #[account(mut)]
    pub publisher: Signer<'info>,

    #[account{
        seeds = [USER_ROLE_SEED.as_ref(), publisher.key().as_ref()],
        bump,
    }]
    pub user_role: Box<Account<'info, UserRole>>,

    #[account(
        mut,
        seeds = [TOPIC_INFO_SEED.as_ref(), publisher.key().as_ref(), nft_mint.key().as_ref()], 
        bump
    )]
    pub topic_info: Box<Account<'info, TopicInfo>>,

    pub nft_mint: Box<Account<'info, Mint>>,

    #[account(mut)]
    pub cost_token_mint: Box<Account<'info, Mint>>,
}

pub fn update_topic(ctx: Context<UpdateTopic>, license_cost: u64) -> Result<()> {
    let accts = ctx.accounts;
    require!(accts.user_role.is_publisher.eq(&true), PaymentControlError::InvalidPublisher);
    
    accts.topic_info.cost_token_mint = accts.cost_token_mint.key();
    accts.topic_info.license_cost = license_cost;

    Ok(())
}
