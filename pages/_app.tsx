import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AleoWalletProvider } from "@/components/AleoWalletProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AleoWalletProvider>
      <Component {...pageProps} />
    </AleoWalletProvider>
  );
}
