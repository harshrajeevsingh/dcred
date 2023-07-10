import Image from 'next/image'
import { ConnectButton } from '@rainbow-me/rainbowkit'
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton/>
      <h1>Hii</h1>
    </main>
  )
}
