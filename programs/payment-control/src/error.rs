use anchor_lang::prelude::*;

#[error_code]
pub enum PaymentControlError {
    #[msg("Admin address dismatch")]
    InvalidAdmin,

    #[msg("Invalid user role")]
    InvalidUserRole,

    #[msg("Invalid subscriber")]
    InvalidSubscriber,

    #[msg("Invalid publisher")]
    InvalidPublisher,
}
