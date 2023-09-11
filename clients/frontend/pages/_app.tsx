'use client';
import { MMAuthProvider } from '@/services/mm/mm';
import { WCClientContextProvider } from '@/services/walletConnect';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { createConfig, configureChains, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { localhost, bsc, bscTestnet, polygon, polygonMumbai, goerli, mainnet } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';

// const settingProvider =
//   process.env.NODE_ENV === 'production'
//     ? [
//         // alchemyProvider({ apiKey: 'HI0VvxVjVNhWlmg4A_mM7AzTAkyKU1dW' }),
//         // infuraProvider({ apiKey: '471baeba6ccd4228b2d67c626e2991be' }),
//         // publicProvider(),
//         jsonRpcProvider({
//           rpc: curChain => {
//             const httpUrl = curChain.rpcUrls.default.http[0] ?? curChain.rpcUrls.public.http[0];
//             return {
//               http: httpUrl.replace('${INFURA_API_KEY}', '471baeba6ccd4228b2d67c626e2991be'),
//             };
//           },
//         }),
//       ]
//     : [
//         jsonRpcProvider({
//           rpc: curChain => {
//             if (curChain.id === localhost.id) {
//               return {
//                 http: 'http://127.0.0.1:8545/',
//               };
//             }
//             return {
//               http:
//                 curChain.network === 'bsc'
//                   ? 'https://1rpc.io/bnb'
//                   : curChain.network === 'bsc-testnet'
//                   ? 'https://api-testnet.bscscan.com/EVTS3CU31AATZV72YQ55TPGXGMVIFUQ9M9'
//                   : curChain.rpcUrls.default.http[0],
//             };
//           },
//         }),
//       ];
//@ts-ignore
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bsc, bscTestnet, polygon, polygonMumbai, localhost, goerli, mainnet],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [new InjectedConnector({ chains })],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <MMAuthProvider>
        <Component {...pageProps} />
      </MMAuthProvider>
    </WagmiConfig>
  );
}
