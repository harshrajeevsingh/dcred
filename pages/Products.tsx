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
    <div  className={`bg-stone-950  min-h-[100vh] gradient-bg-one  w-full pt-36 text-white flex flex-col relative  items-start justify-start `}>Products</div>
  )
}

export default Products