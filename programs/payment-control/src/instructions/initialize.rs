use anchor_lang::prelude::*;
use crate::{constants::*, state::*};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init_if_needed,
        seeds = [GLOBAL_STATE_SEED.as_ref()],
        bump,
        space = GlobalState::DATA_SIZE,
        payer = admin,
    )]
    pub global_state: Box<Account<'info, GlobalState>>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    let accts = ctx.accounts;

    accts.global_state.admin = accts.admin.key();
    accts.global_state.total_topics_count = 0;

    Ok(())
}