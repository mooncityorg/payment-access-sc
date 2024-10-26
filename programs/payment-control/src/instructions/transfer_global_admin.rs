use anchor_lang::prelude::*;
use crate::{constants::*, state::*, error::*};

#[derive(Accounts)]
pub struct TransferGlobalAdmin<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [GLOBAL_STATE_SEED.as_ref()],
        bump
    )]
    pub global_state: Box<Account<'info, GlobalState>>,
}

pub fn transfer_global_admin(ctx: Context<TransferGlobalAdmin>, new_admin: Pubkey) -> Result<()> {
    let accts = ctx.accounts;
    require!(accts.global_state.admin.eq(&accts.admin.key()), PaymentControlError::InvalidAdmin);

    accts.global_state.admin = new_admin;

    Ok(())
}