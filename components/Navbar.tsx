import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import {HiOutlineMenuAlt3} from "react-icons/hi"
import {MdClose} from "react-icons/md"
import Image from 'next/image';

const Navbar= () => {
    const [toggleNav, setToggleNav] = useState(false)
    return (
        <nav  className="w:full flex md:justify-center justify-between items-center p-4">
            <div className="md:flex-[0.5] flex-initial justify-center items-center mr-96 ">
                <Image src="/images/Dcred-logo-new.png" alt="dred-logo" width={200} height={200} className='scale-105'/>
            </div>
            <ul className="text-white hidden md:flex list-none flex-row justify-between items-center flex-initial">
                <li className="mx-4 cursor-pointer">About</li>
                <li className="mx-4 cursor-pointer">Products</li>
                <li className="mx-4 cursor-pointer"><ConnectButton/></li>
            </ul>
            <div className='flex relative'>
                {toggleNav 
                ? <MdClose font-size={28} className='text-white md:hidden cursor-pointer' onClick={()=> setToggleNav(false)}/>
                : <HiOutlineMenuAlt3 font-size={28} className='text-white md:hidden cursor-pointer' onClick={()=> setToggleNav(true)}/>
                }
                {toggleNav && (
                    <ul className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-xl 
                    md:hidden list-none flex flex-col justify-start items-end rounded-md animate-slide-in-right glass-look'>
                        <li className=' text-white text-xl w-full my-2'>
                            <MdClose onClick={()=> setToggleNav(false)}/>
                        </li>
                            <li className="my-2 text-lg text-white">About</li>
                            <li className="my-2 text-lg text-white">Tutorial</li>
                            <li className="my-2 text-lg text-white"><ConnectButton/></li>
                    </ul>
                )}
            </div>
        </nav>
    );
}
export default Navbar