# Program Address
H7mLLoUULceT1iL7XzsYZZCP6Ax7mWQoRDudJLruKkq2

# Keys
- Deploy wallet
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S
- Admin Wallet
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S
- User Wallet [Default]
B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S

# Nft
3yeSAXxzijXDBwFYYitJokfPa1yJXnGbMhQFVS3hkkWc

# Redeploy
solana program deploy ./target/deploy/uranus.so  --keypair /root/.config/solana/id.json

# Status
yarn script status

# Initialize
yarn script init
ex: https://solana.fm/tx/2XhEromZEPzFVRxq5FXcDXuoj7eZc34WmiucVeRfTfHpLLkd18BpWuQ45VUwdWJj3rCdzi9Uw6EWj4X4Y8tsdF6C?cluster=devnet-alpha

# Transfer global admin
yarn script transfer-global-admin -a 4C5xLGfkLi7vY3ShjXy5X6Tu2cz7PvdhLhswhvipbcXC 
ex: https://solana.fm/tx/3yGt1LyQ6MEgCKeLmQCgYsFSrt5HT8xXKe8NAp3Gi2apK4KzCdjpXV7rNYDcsRzU41zRg4wvVbFwPp9rRm7QpTDS?cluster=devnet-alpha

# Init user role
yarn script init-user-rolee
ex: https://solana.fm/tx/2dJRzaRrHFnGGKbpgo96koiaYHkm6oi9wCG629eD7pooxUQJH9SLnkQDo8Ksnxx6kQCcsLF4UkADwPML6Af3Rvhe?cluster=devnet-alpha

# Update user role
yarn script update-user-role -u B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S -f 1
ex: https://solana.fm/tx/tiFLuQNHNUszCCxTpPfTbAgf6pAgFaB6v7JxZV5PDUcrC7P4TcSjDvN1cP3yYmmmyJGnHSDwRueWazW3HMPAD1M?cluster=devnet-alpha

# User status
yarn script user-status -u B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S

# Create topic
yarn script create-topic -m 3yeSAXxzijXDBwFYYitJokfPa1yJXnGbMhQFVS3hkkWc -c XYcsTSE9A4YeJnaYL897e1f2BJxVfk37v2tAjTgAY5o -a 100
ex: https://solana.fm/tx/57WNx5N6guqY4tVeheRhc8TJM4eidrkyX8RSqPAhmhGGduG3wprEVKYgrN3MmiPcz9GcjHBT16ndann3XmtpL1FF?cluster=devnet-alpha

# Topic Info
yarn script topic-info -p B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S -n 3yeSAXxzijXDBwFYYitJokfPa1yJXnGbMhQFVS3hkkWc

# Update topic
yarn script update-topic -m 3yeSAXxzijXDBwFYYitJokfPa1yJXnGbMhQFVS3hkkWc -c D2ZpKW3PPkUct1wsR4C74YyVUHUQHk4CifPQynsFSi -a 300
ex: https://solana.fm/tx/34m39azd1U78TZzdWUrEtLnjR3arBrJXWErmaC9RWNB7DQbhdtCxErxcBEzB7NJwqnd6soQjjtKrt9XLyWDD2XKT?cluster=devnet-alpha

# Add white list
yarn script add-white-list -s 8kFeCZ9Hx7oyYDBssoLKVwAxke9mXW4wt5HF7bFNQY4C
ex: https://solana.fm/tx/5aXQDFhhSaghBtpbZMPLUj5sEs1mbRJHuTe1xugojJuC5e5bMyYpSQNWxZbNLJGRdqGsrRGJQ1eN8HSypiuD22yG?cluster=devnet-alpha

# Whitelist info
yarn script white-list -p B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S -s 8kFeCZ9Hx7oyYDBssoLKVwAxke9mXW4wt5HF7bFNQY4C

# Remove Whitelist
yarn script remove-white-list -s 8kFeCZ9Hx7oyYDBssoLKVwAxke9mXW4wt5HF7bFNQY4C 
ex: https://solana.fm/tx/2VidQzrvEWYQ5uVVhruJB3cfH3ZfnPiZTU1k2cUPEeBLNeneSJkQVzQhXRmUUup8Eb6ykMTni62WnPeAmTFtQEF4?cluster=devnet-alpha

# Purchase license
yarn script purchase-license -p B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S -n 3yeSAXxzijXDBwFYYitJokfPa1yJXnGbMhQFVS3hkkWc -c D2ZpKW3PPkUct1wsR4C74YyVUHUQHk4CifPQynsFSi
ex: https://solana.fm/tx/533WMPLSLQRNpknXK1rYgvA93WJSNt1DAX9c3EzgHVCj38DC5o7GMTG1JbMj2dgZx96mVrCtdYvWHvq3YGKqubad?cluster=devnet-alpha

# Revoke license
yarn script revoke-license -p B7Hd5i7xh92jXPC8NzC96f4vpgV8SfVw4WJ2zgPfR89S -n 3yeSAXxzijXDBwFYYitJokfPa1yJXnGbMhQFVS3hkkWc

