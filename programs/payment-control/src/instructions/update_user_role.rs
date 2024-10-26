use anchor_lang::prelude::*;
use crate::{ constants::*, state::*, error::* };

#[derive(Accounts)]
pub struct UpdateUserRole<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(mut)]
    pub user: SystemAccount<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED.as_ref()],
        bump,
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    #[account{
        init_if_needed,
        seeds = [USER_ROLE_SEED.as_ref(), user.key().as_ref()],
        bump,
        space = UserRole::DATA_SIZE,
        payer = admin
    }]
    pub user_role: Box<Account<'info, UserRole>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn update_user_role(ctx: Context<UpdateUserRole>, is_publisher: bool) -> Result<()> {
    let accts = ctx.accounts;
    require!(accts.global_state.admin.eq(&accts.admin.key()), PaymentControlError::InvalidAdmin);

    if accts.user_role.address.key().eq(&Pubkey::default()) {
        accts.user_role.address = accts.user.key();
    }
    else {
        require!(accts.user_role.address.key().eq(&accts.user.key()), PaymentControlError::InvalidUserRole);
    }
    accts.user_role.is_publisher = is_publisher;

    Ok(())
}