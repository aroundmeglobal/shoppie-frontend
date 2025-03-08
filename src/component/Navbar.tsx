import React from "react";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <div className="z-[11] flex items-center justify-between w-full p-4 px-4  max-w-screen-2xl sticky top-0  bg-[#0D0D0D] border-b-[#2B2B2B] border-b-2">
      <button >
        <Image alt="shoppie" src={"/img/SHOPPIE.svg"} width={0} height={10} className="w-[100px] md:w-[150px]"/>
      </button>
      <div className="flex gap-5 ">
        <button className="font-bold text-[10px] md:text-[16px]">sign up</button>
        <button className="bg-white text-black rounded-[80px] py-2 px-3 flex gap-2 text-[16px] items-center justify-center">
          <Link href={"/login"} className="font-bold text-[10px] md:text-[16px]">Create your AI</Link>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
