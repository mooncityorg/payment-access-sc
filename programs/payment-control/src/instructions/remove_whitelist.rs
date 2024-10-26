use anchor_lang::prelude::*;
use crate::{ constants::*, state::*, error::* };

#[derive(Accounts)]
pub struct RemoveWhiteList<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED.as_ref()],
        bump
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account{
        seeds = [USER_ROLE_SEED.as_ref(), publisher.key().as_ref()],
        bump
    }]
    pub publisher_role: Box<Account<'info, UserRole>>,

    #[account(
        init_if_needed,
        seeds = [WHITE_LIST_SEED.as_ref(), publisher.key().as_ref(), subscriber.key().as_ref()],
        bump,
        space = WhiteListInfo::DATA_SIZE,
        payer = user
    )]
    pub white_list_info: Box<Account<'info, WhiteListInfo>>,

    pub publisher: SystemAccount<'info>,

    pub subscriber: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn remove_white_list(ctx: Context<RemoveWhiteList>) -> Result<()> {
    let accts = ctx.accounts;
    require!(
        accts.publisher_role.is_publisher.eq(&true) || accts.global_state.admin.eq(&accts.user.key()),
        PaymentControlError::InvalidPublisher
    );

    accts.white_list_info.publisher = accts.publisher.key();
    accts.white_list_info.subscriber = accts.subscriber.key();
    accts.white_list_info.allowed = false;

    Ok(())
}
