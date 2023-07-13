import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";

import "../styles/globals.css"
import {
  wagmiConfig,
  WagmiConfig,
  RainbowKitProvider,
  chains,
} from "../components/wagmi";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
        </RainbowKitProvider>
    </WagmiConfig>
    </>
  );
}

export default MyApp;
