import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { Dcred_Address, Dcred_Abi } from "@/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { LineChart, Line, BarChart, Bar } from "recharts";

interface AllProducts {
  id: bigint;
  ownerAddr: string;
  pname: string;
  desc: string;
  price: bigint;
}
type myProd = [BigInt];

interface Ilist {
  cashback: {}[];
  spent: {}[];
  bought: {}[];
}
const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { chain } = useNetwork();
  const [addProd, setAddProd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [allProds, setAllProds] = useState<AllProducts[]>();
  const [myProds, setMyProds] = useState<myProd>();
  const [lists, setLists] = useState<Ilist>({
    cashback: [],
    spent: [],
    bought: [],
  });

  const cbList = useRef<[number]>(null!);

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
        args: [val.name, val.desc, BigInt(val.price * 10 ** 18)],
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

  const total = useRef<number>(null!);
  const totalcb = useRef<number>(null!);

  const getMyProducts = async () => {
    try {
      const allData = await publicClient.readContract({
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

      if (!data && !allData && !boughtList && !cashbackList && !spendList)
        return;
      setLoading(false);

      setAllProds(allData as AllProducts[]);
      setMyProds(data as myProd);

      let areadata: {}[] = [];
      let cbdata = cashbackList as [BigInt];

      cbdata?.forEach((val) => {
        areadata.push({
          uv: Number(val),
        });
      });
      totalcb.current = cbdata.reduce((acc, val) => acc + Number(val), 0);
      let boughtdata: {}[] = [];
      let bdata = boughtList as [BigInt];

      bdata?.forEach((val) => {
        boughtdata.push({
          uv: Number(val) + 1,
        });
      });

      let sdata: {}[] = [];
      let spdata = spendList as [BigInt];
      spdata?.forEach((val) => {
        sdata.push({
          uv: Number(val),
        });
      });
      total.current = spdata.reduce((acc, val) => acc + Number(val), 0);

      //   console.log(cbdata);
      //  console.log(areadata);
      setLists({
        cashback: areadata as any,
        bought: boughtdata,
        spent: sdata,
      });
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(myProds);
  // console.log(allProds);

  useEffect(() => {
    getMyProducts();
  }, []);

  return (
    <div
      className={`bg-stone-950  min-h-[100vh] gradient-bg-one  w-full pt-36 text-white flex flex-col relative  items-center justify-start `}
    >
      <ToastContainer />
      {!loading && (
        <>
          <div
            className={` w-full h-[100vh] absolute flex  items-center justify-center  transition-all duration-300 ease-linear  ${
              addProd ? "scale-100 bg-black/30  top-0 z-20 " : " flex scale-0"
            }`}
          >
            <div className=" bg-black text-white items-start justify-start gap-2 my-auto flex flex-col h-max w-[50%]">
              <span className="text-3xl  flex justify-between sm:text-4xl w-full px-8 mt-4">
                <span> Add Product </span>
                <button
                  onClick={() => setAddProd(false)}
                  className={`text-sm `}
                >
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

          <div
            className={`flex gap-20 mt-10 px-36 items-center justify-evenly `}
          >
            <div className="flex flex-col items-center justify-center gap-5">
              <BarChart width={300} height={150} data={lists.bought}>
                <Bar dataKey="uv" fill="#c77dff" />
              </BarChart>
              <h1>Bought Index</h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
              <LineChart width={500} height={150} data={lists.cashback}>
                <Line
                  type="monotone"
                  dataKey="uv"
                  stroke="#c77dff"
                  strokeWidth={2}
                />
              </LineChart>
              <h1>Cashback</h1>
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
              <span> Total spent </span>
              <span className={`text-3xl font-bold text-[#e0aaff] text-center`}>
                {" "}
                {total?.current / 10 ** 18} {chain?.nativeCurrency.symbol}{" "}
              </span>
              <span>Total Cashback Earned </span>
              <span className={`text-3xl font-bold text-[#e0aaff] text-center`}>
                {" "}
                {totalcb?.current / 10 ** 18} {chain?.nativeCurrency.symbol}{" "}
              </span>
            </div>
          </div>

          <div
            className={`w-full px-36 flex flex-col items-start justify-center mt-20`}
          >
            <h1 className={`text-xl font-bold text-[#e0aaff] text-center mb-4`}>
              All listed Products
            </h1>

            {myProds &&
              allProds &&
              myProds?.map((obj, idx) => {
                return (
                  <div
                    key={idx}
                    className={`flex border-b border-dashed mb-2 w-full`}
                  >
                    <h1 className={` w-1/3 truncate`}>
                      {allProds[Number(obj)].pname.toUpperCase()}
                    </h1>
                    <h1 className={` w-1/3 truncate`}>
                      {allProds[Number(obj)].desc}
                    </h1>
                    <h1 className={` w-1/3 text-center truncate`}>
                      {Number(allProds[Number(obj)].price) / 10 ** 18}{" "}
                      {chain?.nativeCurrency.symbol}
                    </h1>
                  </div>
                );
              })}
          </div>
        </>
      )}

      <div role="status">
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
    </div>
  );
};

export default dynamic(() => Promise.resolve(Dashboard), { ssr: false });
