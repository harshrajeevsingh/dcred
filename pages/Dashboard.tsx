import Link from "next/link";
import React, { useRef, useState } from "react";

const Dashboard = () => {
  const [addProd, setAddProd] = useState<boolean>(false);
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
  console.log(data);
  return (
    <div
      className={`bg-black min-h-[100vh]   w-full pt-36 text-white flex flex-col relative  items-start justify-start `}
    >
      
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
            // onClick={() => addingPatientData(form)}
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
    </div>
  );
};

export default Dashboard;
