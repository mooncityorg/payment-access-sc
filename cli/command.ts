import { program } from 'commander';
import { Cluster, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { getGlobalInfo, loadWalletFromKeypair, setConnection, initProject, transferGlobalAdmin, initUserRole, updateUserRole, createTopic, updateTopic, addWhiteList, removeWhiteList, purchaseLicense, revokeLicense, getUserRoleInfo, getTopicInfo, getWhiteListInfo, getLicenseInfo } from './scripts';

program.version('0.0.1');

programCommand('status')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await getGlobalInfo();
    });

programCommand('user-status')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .requiredOption('-u --user <string>', 'User')
    .action(async (directory, cmd) => {
        const { user, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await getUserRoleInfo(new PublicKey(user));
    });

programCommand('topic-info')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .requiredOption('-p --publisher <string>', 'Publisher')
    .requiredOption('-n --nft_mint <string>', 'Nft mint address')
    .action(async (directory, cmd) => {
        const { publisher, nft_mint, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await getTopicInfo(new PublicKey(publisher), new PublicKey(nft_mint));
    });

programCommand('white-list')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .requiredOption('-p --publisher <string>', 'Publisher')
    .requiredOption('-s --subscriber <string>', 'Subscriber')
    .action(async (directory, cmd) => {
        const { publisher, subscriber, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await getWhiteListInfo(new PublicKey(publisher), new PublicKey(subscriber));
    });

programCommand('license-info')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .requiredOption('-p --publisher <string>', 'Publisher')
    .requiredOption('-s --subscriber <string>', 'Subscriber')
    .requiredOption('-n --nft_mint <string>', 'Nft mint address')
    .action(async (directory, cmd) => {
        const { publisher, subscriber, nft_mint, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await getLicenseInfo(new PublicKey(publisher), new PublicKey(subscriber), new PublicKey(nft_mint));
    });

programCommand('init')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await initProject();
    });

programCommand('transfer-global-admin')
    .requiredOption('-a --admin <string>', 'New admin')
    .action(async (directory, cmd) => {
        const { admin, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await transferGlobalAdmin(new PublicKey(admin));
    })

programCommand('init-user-role')
    .action(async (directory, cmd) => {
        const { env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await initUserRole();
    })

programCommand('update-user-role')
    .requiredOption('-u --user <string>', 'User')
    .requiredOption('-f --flag <number>', 'Is publisher')
    .action(async (directory, cmd) => {
        const { user, flag, env,rpcurl, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await updateUserRole(flag == 1 ? true : false, new PublicKey(user));
    })    

programCommand('create-topic')
    .requiredOption('-m --mint <string>', 'Nft mint address')
    .requiredOption('-c --cost_token <string>', 'Cost token mint')
    .requiredOption('-a --amount <number>', 'Cost token amount')
    .action(async (directory, cmd) => {
        const { mint, cost_token, amount, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await createTopic(new PublicKey(mint), new PublicKey(cost_token), new anchor.BN(amount));
    })

programCommand('update-topic')
    .requiredOption('-m --mint <string>', 'Nft mint address')
    .requiredOption('-c --cost_token <string>', 'Cost token mint')
    .requiredOption('-a --amount <number>', 'Cost token amount')
    .action(async (directory, cmd) => {
        const { mint, cost_token, amount, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await updateTopic(new PublicKey(mint), new PublicKey(cost_token), new anchor.BN(amount));
    })

programCommand('add-white-list')
    .requiredOption('-s --subscriber <string>', 'Subscriber')
    .action(async (directory, cmd) => {
        const { subscriber, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await addWhiteList(new PublicKey(subscriber));
    })

programCommand('remove-white-list')
    .requiredOption('-s --subscriber <string>', 'Subscriber')
    .action(async (directory, cmd) => {
        const { subscriber, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await removeWhiteList(new PublicKey(subscriber));
    })

programCommand('purchase-license')
    .requiredOption('-p --publisher <string>', 'Publisher')
    .requiredOption('-n --nft_mint <string>', 'Nft mint address')
    .requiredOption('-c --cost_token_mint <string>', 'Cost token address')
    .action(async (directory, cmd) => {
        const { publisher, nft_mint, cost_token_mint, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await purchaseLicense(new PublicKey(publisher), new PublicKey(nft_mint), new PublicKey(cost_token_mint));
    })

programCommand('revoke-license')
    .requiredOption('-p --publisher <string>', 'Publisher')
    .requiredOption('-n --nft_mint <string>', 'Nft mint address')
    .action(async (directory, cmd) => {
        const { publisher, nft_mint, cost_token_mint, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await revokeLicense(new PublicKey(publisher), new PublicKey(nft_mint));
    })

function programCommand(name: string) {
    return program
        .command(name)
        .requiredOption('-e, --env <string>', 'alias to web3.Cluster', 'devnet') // mainnet-beta, testnet, devnet
        .option(
            '-r, --rpc <string>', 
            'Solana cluster RPC', 
            'https://devnet.helius-rpc.com/?api-key=44b7171f-7de7-4e68-9d08-eff1ef7529bd'
        )
        .option(
            '-k, --keypair <string>',
            'Solana wallet keypair path',
            '/root/.config/solana/id.json'
        )
}

program.parse(process.argv);
