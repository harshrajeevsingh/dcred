import React, { useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useNetwork,
} from "wagmi";
import { Dcred_Address, Dcred_Abi } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

interface AllProducts {
  id: bigint;
  ownerAddr: string;
  pname: string;
  desc: string;
  price: bigint;
}

const Products = () => {
  const [allProds, setAllProds] = useState<AllProducts[]>();
  const { chain } = useNetwork();
  const { address , isConnected} = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState<boolean>(true);

  const getMyProducts = async () => {
    try {
      const allData = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getAllProducts",

      });
     console.log(allData);
      if (!allData) return;
      setLoading(false)
      setAllProds(allData as AllProducts[]);
    } catch (error) {
      console.log(error);
    }
  };

  async function buytheproduct(val : number , id : BigInt){
    try{
      // console.log(Number(id));
      const { request } = await publicClient.simulateContract(
        {
          address: Dcred_Address,
          abi: Dcred_Abi,
          functionName: "buyProduct",
          account: address,
          args: [Number(id)],
          value : BigInt(val)
        }
      );

      const tx = await walletClient?.writeContract(request);
      console.log("Transaction Hash --->>>",tx);
      toast.success("Product buying.......")
     
      if(!tx)return
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log("Transaction --->>>",transaction);
     toast.success("Product bought successfully")
    }catch(err){console.log(err)}
  }


  useEffect(() => {
    getMyProducts();
  }, []);


  return (
    <div
      className={`bg-stone-950 w-full flex flex-col items-center justify-start min-h-screen gradient-bg-one pt-36 text-white`}
    >
       <div role="status" className={`w-full items-center justify-center flex`}>
        <svg
          aria-hidden="true"
          className={`w-32  h-32 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#e0aaff] ${
            loading ? "block" : "hidden"
          }`}
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
      <ToastContainer/>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(allProds && !loading) &&
          allProds.map((item, index) => (
            <div
              key={index}
              className="glass-look-three rounded-md p-4 shadow-md flex flex-col justify-between"
            >
              <div>
                <p className="text-2xl text-stone-800 font-semibold mb-1.5 truncate">
                  {item.pname}
                </p>
                <p className="text-stone-700 text-xs mb-2.5 truncate">
                  {item.ownerAddr}
                </p>
                <p className="text-stone-600 text-base mb-2">{item.desc}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-stone-700 text-lg">
                  {Number(item.price) / 10 ** 18} {chain?.nativeCurrency.symbol}
                </p>
                <button
                onClick={()=>buytheproduct(Number(item.price) , item.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-blue-600 hover:text-white">
                  Buy
                </button>
              </div>
            </div>
          )) 
          }
      </div>

      
    </div>
  );
};
export default dynamic(() => Promise.resolve(Products), { ssr: false });
