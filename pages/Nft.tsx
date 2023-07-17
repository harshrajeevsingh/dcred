import React from "react";
import { useAccount, useWalletClient, usePublicClient ,  } from "wagmi";
// import { getContract } from "wagmi/actions";
import { parseEther, encodeAbiParameters, parseAbiParameters, formatEther } from "viem";
import { Dcred_Address, Dcred_Abi } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const Nft = () => {
  const { address , isConnected} = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
 

  const mint = async () => {
    try {
      if (!isConnected)toast.error("Please connect your wallet");

      const { request } = await publicClient.simulateContract(
        {
          address: Dcred_Address,
          abi: Dcred_Abi,
          functionName: "mint",
          account: address,
          args: [address],
          value : BigInt(10000000000000000)
        }
      );

      const tx = await walletClient?.writeContract(request);
      console.log("Transaction Hash --->>>",tx);
     
      if(!tx)return
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log("Transaction --->>>",transaction);
     toast.success("NFT bought successfully")
    } catch (err : any) {
      console.log(err);
      toast.error(err.shortMessage)
    }
  };
 

  return (
    <div
      className={` gradient-bg-three min-h-screen w-full flex flex-col items-center justify-center pt-36`}
    >
       <ToastContainer />
      <div
        className={`grid md:grid-cols-2 grid-cols-1 rounded-2xl overflow-hidden text-white w-[60%] h-[max] `}
      >
        <div
          className={` bg-white/20  p-4 backdrop-blur-sm  flex flex-col items-center justify-center rounded-sm`}
        >
          <h1 className={`text-2xl `}>DCRED Credit NFTs</h1>
          <p className={`text-sm pt-5 `}>
            The DCRED is a simple credit card solution for generation Z .{" "}
          </p>
          <p className={`text-sm pt-3 `}>
            This can provide all the features which we can obtain in traditional
            credit cards with parental control (future implementation), with low
            assured 5% cashback with every purchase.
          </p>
          <p className={`text-sm pt-3 `}>
            Not only that you can set up your own store like shopify if you want
            and can share product links to earn revenue
          </p>
          <p className={`text-sm pt-3 `}>
            And NOT ONLY THAT, you can also see all the analytics and work with
            the data and can figure out how much did you spent and how much
            cashback did you earned.
          </p>

          <button onClick={mint} className={` px-4 py-2 mt-10 rounded-xl bg-[#4d33f6] `}>
            Buy Now!
          </button>
        </div>
        <div className={`   rounded-sm`}>
          <img src="/images/DCRED.png" alt="credit" />
        </div>
      </div>
    </div>
  );
};

export default Nft;






