import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [polygonMumbai ],
  [
    alchemyProvider({ apiKey: "lNHE8SSqfOyyifdNCKx_h1RIRXDrHew3" }),
    publicProvider(),
  ]
);

const walletConnectProjectId = "952483bf7a0f5ace4c40eb53967f1368";

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: walletConnectProjectId,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { wagmiConfig, WagmiConfig, chains, RainbowKitProvider };