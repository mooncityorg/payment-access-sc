use anchor_lang::prelude::*;
use crate::{ constants::*, state::* };

#[derive(Accounts)]
pub struct InitUserRole<'info> {
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

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn init_user_role(ctx: Context<InitUserRole>) -> Result<()> {
    let accts = ctx.accounts;

    accts.user_role.address = accts.user.key();
    accts.user_role.is_publisher = false;

    Ok(())
}