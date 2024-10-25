use anchor_lang::prelude::*;
use crate::{ constants::*, state::*, error::* };

#[derive(Accounts)]
pub struct RemoveWhiteList<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        seeds = [GLOBAL_STATE_SEED.as_ref()],
        bump,
        space = GlobalState::DATA_SIZE,
        payer = user
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account{
        init,
        seeds = [USER_ROLE_SEED.as_ref(), user.key().as_ref()],
        bump,
        space = UserRole::DATA_SIZE,
        payer = user
    }]
    pub user_role: Box<Account<'info, UserRole>>,

    #[account(
        init_if_needed,
        seeds = [WHITE_LIST_SEED.as_ref(), publisher.key().as_ref(), subscriber.key().as_ref()],
        bump,
        space = WhiteListInfo::DATA_SIZE,
        payer = user
    )]
    pub white_list_info: Box<Account<'info, WhiteListInfo>>,

    #[account(mut)]
    pub publisher: SystemAccount<'info>,

    #[account(mut)]
    pub subscriber: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn remove_white_list(ctx: Context<RemoveWhiteList>) -> Result<()> {
    let accts = ctx.accounts;
    require!(
        accts.user_role.is_publisher.eq(&true) || accts.global_state.admin.eq(&accts.user.key()),
        PaymentControlError::InvalidPublisher
    );

    accts.white_list_info.allowed = false;

    Ok(())
}
