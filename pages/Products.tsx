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

console.log(allProds);
  const getMyProducts = async () => {
    try {
      const allData = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getAllProducts",

      });
     console.log(allData);
      if (!allData) return;

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
      className={`bg-stone-950  min-h-screen gradient-bg-one pt-36 text-white`}
    >
      <ToastContainer/>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProds &&
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
          ))}
      </div>

      
    </div>
  );
};

export default Products;
