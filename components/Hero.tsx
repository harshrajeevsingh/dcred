import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit'

const Hero = () => {
    return(
        <div className="flex w-full justify-center items-center pt-24">
            <div className="flex md:flex-row flex-col items-start justify-between md:p-10 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col mt-16">
                    <h1 className="text-2xl italic sm:text-5xl text-white py-1 font-extrabold">
                        Win assured <span className='underline decoration-wavy decoration-[#B17764] decoration-2 underline-offset-2 text-gradient-two'>Cashback</span> <br />on every purchase 
                        <span className='not-italic text-4xl'>🎉</span>
                    </h1>
                    <p className="text-light mt-5 text-white font-light md:w-9/12 w-11/12 text-base tracking-wider">
                        Sign up, get a NFT and win cashback on every item that you purchase from our platform.
                    </p>
                    <div className='mt-5'>
                    <ConnectButton/>
                    </div>
                </div> 
                <div>
                <Image src="/images/profitHandIcon.png" alt="profitHand-illus" width={400} height={400} />
                </div>
            </div>
        </div>
    );
}
export default Hero