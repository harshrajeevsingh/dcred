import Image from 'next/image';
import {BsFill1SquareFill, BsFill2SquareFill, BsFill3SquareFill} from "react-icons/bs";

const About = () => {
    return (
        <div id='#about' className="flex flex-col w-full justify-center items-center gradient-bg-two">
            <div className='mb-20'>
                <h1 className="text-3xl font-bold text-white sm:text-5xl text-gradient">So, How It Works..</h1>
            </div>
            <div className="flex md:flex-row flex-col justify-between items-center gap-32 md:p-10 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col ">
                    <h1 className="text-2xl sm:text-3xl italic text-white py-1 font-light">
                        Sign up on our platform <br /> and get a NFT
                    </h1>
                </div> 
                <div className='glass-look-two rounded-full'>
                <Image src="/images/crypto-trading.png" alt="crypto-nft-trade-illus" width={250} height={250} />
                </div>
            </div>
            <div className="flex md:flex-row flex-col justify-between items-center gap-32 md:p-10 py-12 px-4">
                <div className='glass-look-two rounded-full'>
                <Image src="/images/shop-button.png" alt="shop-button-illus" width={250} height={250} className='clip'/>
                </div>
                <div className="flex flex-1 justify-start flex-col ">
                    <h1 className="text-2xl sm:text-3xl italic text-white py-1 font-light">
                        Puchase any item from <br /> the shop of your choice
                    </h1>
                </div> 
            </div>
            <div className="flex md:flex-row flex-col justify-between items-center gap-32 md:p-10 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col ">
                    <h1 className="text-2xl sm:text-3xl italic text-white py-1 font-light">
                        Receive Cashback directly<br /> in your wallet
                    </h1>
                </div> 
                <div className='glass-look-two rounded-full'>
                <Image src="/images/crypto-wallet.png" alt="crypto-Wallet-illus" width={250} height={250} />
                </div>
            </div>

        </div>
    );
}

export default About