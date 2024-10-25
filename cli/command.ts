import { program } from 'commander';
import { Cluster, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { getGlobalInfo, loadWalletFromKeypair, setConnection,setPrice, setFeeWallet, initProject, mintNft } from './scripts';

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

programCommand('set-price')
    .requiredOption('-p --price <string>', 'Nft price')
    .action(async (directory, cmd) => {
        const { price, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await setPrice(new anchor.BN(price));
    })

programCommand('set-fee-wallet')
    .requiredOption('-w --wallet <string>', 'Fee wallet address')
    .action(async (directory, cmd) => {
        const { wallet, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await setFeeWallet(new PublicKey(wallet));
    })

programCommand('mint')
    .action(async (directory, cmd) => {
        const { wallet, env, keypair, rpc } = cmd.opts();

        await setConnection({
            cluster: env as Cluster,
            wallet: loadWalletFromKeypair(keypair),
            rpc,
        });

        await mintNft(rpc);
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