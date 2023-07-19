import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { Dcred_Address, Dcred_Abi } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseEther } from "viem";
import { AreaChart, Area , LineChart, Line , BarChart, Bar, } from "recharts";

interface AllProducts {
  id : bigint;
  ownerAddr : string;
  pname : string;
  desc : string;
  price : bigint
 }
type myProd  = [BigInt]

interface Ilist{
  cashback : {}[],
  spent : {}[],
  bought : {}[],
}
const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [addProd, setAddProd] = useState<boolean>(false);

  const [allProds, setAllProds] = useState<AllProducts[]>();
  const [myProds, setMyProds] = useState<myProd>();
  const [lists, setLists] = useState<Ilist>({
    cashback : [],
    spent : [],
    bought : []
  });

  const cbList = useRef<[number]>(null!)

  
  const [data, setData] = useState<{}>({
    name: "",
    price: "",
    desc: "",
  });

  function handleform(e: React.ChangeEvent<HTMLInputElement>) {
    //  console.log(e.target.value);
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  async function addProductToContract(val: any) {
    try {
      if (!val.name && !val.price && !val.desc) {
        toast.error("Invalid Inputs");
        return;
      }
      if (!isConnected) {
        toast.error("Please connect your wallet");
        return;
      }

      const { request } = await publicClient.simulateContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "addProduct",
        account: address,
        args: [val.name, val.desc, BigInt(val.price * 10**18)],
      });

      const tx = await walletClient?.writeContract(request);
      console.log("Transaction Hash --->>>", tx);
      toast("Product adding........");
      if (!tx) return;
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });
      console.log("Transaction --->>>", transaction);
      toast.success("Product added successfully");

      console.log(val);
    } catch (err) {
      console.log(err);
      // toast.error(err.message);
    }
  }

  // type MyProduct = [bigint]
  
  

  const getMyProducts = async () => {
    try {
      const allData  = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getAllProducts",
        args: [],
      });
      const data = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getMyListedProducts",
        args: [address],
      });
      const boughtList = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getMyBoughtList",
        args: [address],
      });
      const cashbackList = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getCashbackList",
        args: [address],
      });
      const spendList = await publicClient.readContract({
        address: Dcred_Address,
        abi: Dcred_Abi,
        functionName: "getSpendList",
        args: [address],
      });


      if (!data && !allData && !boughtList && !cashbackList && !spendList) return;

  
      setAllProds(allData as AllProducts[])
      setMyProds(data as myProd)
     

      let areadata : {}[] = [] ;
      let cbdata = cashbackList as [BigInt] ;

      cbdata?.forEach(val => {
        areadata.push({
          uv : Number(val)
        })
      })
      let boughtdata : {}[] = [] ;
      let bdata = boughtList as [BigInt] ;

      bdata?.forEach(val => {
        boughtdata.push({
          uv : Number(val) + 1
        })
      })

      let sdata : {}[] = [] ;
      let spdata = cashbackList as [BigInt] ;

      spdata?.forEach(val => {
        sdata.push({
          uv : Number(val)
        })
      })
    //   console.log(cbdata);
    //  console.log(areadata);
      setLists({
        cashback : areadata as any,
        bought : boughtdata,
        spent : sdata
      })
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(myProds);
  // console.log(allProds);
  console.log(lists);
  useEffect(()=>{
    getMyProducts()
  },[])

  return (
    <div
      className={`bg-stone-950  min-h-[100vh] gradient-bg-one  w-full pt-36 text-white flex flex-col relative  items-start justify-start `}
    >
      <ToastContainer />
      <div
        className={` w-full h-[100vh] absolute flex  items-center justify-center  transition-all duration-300 ease-linear  ${
          addProd ? "scale-100 bg-black/30  top-0 z-20 " : " flex scale-0"
        }`}
      >
        <div className=" bg-black text-white items-start justify-start gap-2 my-auto flex flex-col h-max w-[50%]">
          <span className="text-3xl  flex justify-between sm:text-4xl w-full px-8 mt-4">
            <span> Add Product </span>
            <button onClick={() => setAddProd(false)} className={`text-sm `}>
              Close
            </button>
          </span>
          <span className="text-base mx-8 text-gray-500 ">
            Commission for every product is 10% , Price accordingly
          </span>
          <div
            className={` gap-1 flex w-full flex-col items-start  justify-center mt-4 sm:text-xl text-sm`}
          >
            <span className=" text-lg mx-8">Name</span>
            <input
              type="text"
              onChange={handleform}
              name="name"
              className="text-start text-black text-sm border mx-8 border-zinc-300 indent-4 rounded-sm w-9/12 h-8 "
              placeholder="Your Product Name"
            />
            <span className=" text-lg mx-8">Description</span>
            <input
              type="text"
              onChange={handleform}
              name="desc"
              className="text-start text-black text-sm border mx-8 border-zinc-300 indent-4 rounded-sm w-9/12 h-8 "
              placeholder="A cute little description about your product"
            />
            <span className=" text-lg mx-8">Price</span>
            <input
              type="number"
              onChange={handleform}
              name="price"
              className="text-start text-black text-sm border mx-8 border-zinc-300 indent-4 rounded-sm w-9/12 h-8 "
              placeholder="$1231"
            />
          </div>
          <button
            onClick={() => addProductToContract(data)}
            className="mt-17 m-8 rounded-md py-2 px-4 hover:bg-[#4d33f6] bg-[#5d33f6]"
          >
            Add Product
          </button>
        </div>
      </div>

      <div className={`w-full h-full flex flex-col items-start px-36`}>
        <button
          className={` px-4 py-2 rounded-xl bg-[#4d33f6] ${
            addProd ? "hidden" : "block"
          }`}
          onClick={() => setAddProd((prev) => !prev)}
        >
          Add Product
        </button>
      </div>
    
      <div className={`flex gap-20 mt-10 px-36 items-center justify-evenly `}>

      <BarChart width={300} height={150} data={lists.bought}>
          <Bar dataKey="uv" fill="#c77dff" />
        </BarChart>
 
     
    <LineChart width={500} height={150} data={lists.cashback}>
      <Line type="monotone" dataKey="uv" stroke="#c77dff" strokeWidth={2} />
    </LineChart>
          <h1>Cashback</h1>
      </div>

     <div className={`w-full px-36 flex items-center justify-center mt-20`}>
    
     </div>

    {myProds && allProds && myProds?.map((obj , idx)=> {
     return( <div key={idx}>
             <h1>{allProds[Number(obj)].pname}</h1>
             <h1>{allProds[Number(obj)].desc}</h1>
             <h1>{Number(allProds[Number(obj)].price) / 10**18}</h1>
      </div>)
    })}
    
  

    
    </div>
  );
};

export default Dashboard;
