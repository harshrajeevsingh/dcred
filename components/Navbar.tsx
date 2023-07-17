import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const [toggleNav, setToggleNav] = useState(false);
  return (
    <nav className=" fixed top-0 w-full z-30 flex md:justify-center justify-between items-center p-4">
      <div className="md:flex-[0.5] flex-initial justify-center items-center mr-96 ">
        <Image
          src="/images/Dcred-logo-new.png"
          alt="dred-logo"
          width={200}
          height={200}
          className="scale-105"
        />
      </div>
      <ul className="text-white  md:flex list-none flex-row justify-between items-center flex-initial">
        <Link href={"/"} className="mx-4 cursor-pointer">
          Home
        </Link>
        <Link href={"/Nft"} className="mx-4 cursor-pointer">
          Buy NFT
        </Link>
        <Link href={"/Dashboard"} className="mx-4 cursor-pointer">
          Dashboard
        </Link>
        <Link href={"/Products"} className="mx-4 cursor-pointer">
          Products
        </Link>
        <li className="mx-4 cursor-pointer">
          <ConnectButton />
        </li>
      </ul>
      <div className="flex relative">
        {toggleNav ? (
          <MdClose
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleNav(false)}
          />
        ) : (
          <HiOutlineMenuAlt3
            className="text-white md:hidden cursor-pointer"
            onClick={() => setToggleNav(true)}
          />
        )}
        {toggleNav && (
          <ul
            className="z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-xl 
                    md:hidden list-none flex flex-col justify-start items-end rounded-md animate-slide-in-right glass-look"
          >
            <li className=" text-white text-xl w-full my-2">
              <MdClose onClick={() => setToggleNav(false)} />
            </li>
            <Link href={"/"} className="mx-4 cursor-pointer">
              Home
            </Link>
            <Link href={"/Nft"} className="mx-4 cursor-pointer">
              Buy NFT
            </Link>
            <Link href={"/Dashboard"} className="mx-4 cursor-pointer">
              Dashboard
            </Link>
            <Link href={"/Products"} className="mx-4 cursor-pointer">
              Products
            </Link>
            <li className="mx-4 cursor-pointer">
              <ConnectButton />
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
