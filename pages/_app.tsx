import "@rainbow-me/rainbowkit/styles.css";
import { AppProps } from "next/app";

import "../styles/globals.css"
import {
  wagmiConfig,
  WagmiConfig,
  RainbowKitProvider,
  chains,
} from "../components/wagmi";
import Navbar from "@/components/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <Navbar/>
        <Component {...pageProps} />
        </RainbowKitProvider>
    </WagmiConfig>
    </>
  );
}

export default MyApp;
