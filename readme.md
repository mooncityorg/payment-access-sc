# Program Address
HRceqCTGW1vmA4aVq96x76C5PvYDVYTfaCTKLUZnivMT

# Keys
- Deploy wallet
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S
- Admin Wallet
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S
- Updater Wallet
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S
- User Wallet [Default]
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S

# Redeploy
solana program deploy ./target/deploy/uranus.so  --keypair /root/.config/solana/id.json

# Status
yarn script status

# Initialize
yarn script init

# User

# Admin
yarn script set-price -p 100
yarn script set-fee-wallet -w B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S

# Updater
