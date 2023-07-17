import React, { useEffect, useState } from 'react'
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Dcred_Address, Dcred_Abi } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



interface AllProducts {
  id : bigint;
  ownerAddr : string;
  pname : string;
  desc : string;
  price : bigint
 }

const Products = () => {
  const [allProds, setAllProds] = useState<AllProducts[]>();
  const publicClient = usePublicClient();

  const getMyProducts = async () => {
    try {
      const allData  = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getAllProducts",
        args: [],
      });
      
      if (!allData ) return;

  
      setAllProds(allData as AllProducts[])
      
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log(allProds);

  useEffect(()=>{
    getMyProducts()
  },[])

  console.log(allProds);
  return (
    <div  className={`bg-stone-950  min-h-screen gradient-bg-one pt-36 text-white`}>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allProds &&
          allProds.map((item, index) => (
          <div key={index} className="glass-look-three rounded-md p-4 shadow-md flex flex-col justify-between">
            <div>
              <p className="text-lg text-gray-800 font-semibold mb-2">{item.pname}</p>
              <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
              <p className="text-gray-700 truncate">{item.ownerAddr}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-gray-700 text-lg">{Number(item.price) / 10 ** 18}</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-blue-600 hover:text-white">Buy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products