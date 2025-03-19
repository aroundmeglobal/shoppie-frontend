"use client";

import React from "react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import useRemoveAuthToken from "@/hooks/useRemoveAuthToken";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function Navbar() {
  const pathname = usePathname();
  const isLoggedIn = useAuth();
  const removeAuthToken = useRemoveAuthToken();
  const params = useParams();
  const onLogin = () => {
    if (window.innerWidth < 768) {
      toast.error("This feature is available only on desktop.", {
        duration: 2000,
        position: "top-center",
      });
      return;
    }
    const targetUrl = isLoggedIn ? "/brand/profile" : "/login";
    window.open(targetUrl, "_blank");
  };

  const onLogout = () => {
    removeAuthToken();
  };

  return (
    <div className="z-[11] flex items-center justify-between w-full p-4 px-4   h-16   sticky top-0  bg-black border-b-[#2B2B2B] border-b-[0.1px] border-opacity-50">
      <Link target="_blank" href={"https://goshoppie.com/"}>
        <Image
          alt="shoppie"
          src={"/img/shoppie.png"}
          width={10}
          height={10}
          className="w-[100px] md:w-[150px] h-[29px] object-contain "
        />
      </Link>
      {(pathname === "/" || pathname === `/${params?.id}`) && (
        <div className="flex gap-5 ">
          {/* <button
            onClick={onLogout}
            className="cursor-pointer font-bold text-[10px] md:text-[16px]"
          >
            {isLoggedIn ? "Log out" : ""}
          </button> */}
          {/* <a
            onClick={onLogin}
            className="cursor-pointer relative  flex items-center  justify-center px-2 py-[2px] text-white text-[15px]  leading-[25px] tracking-[-0.5px] bg-[#0055FF] rounded-[10px] border-[2.1px] border-white/15 shadow-[0px_8px_40px_rgba(0,85,255,0.5),0px_0px_10px_rgba(255,255,255,0)_inset,0px_0px_0px_1px_rgba(0,85,255,0.12)] transition-all duration-300 hover:shadow-[0px_8px_50px_rgba(0,85,255,0.6),0px_0px_12px_rgba(255,255,255,0)_inset,0px_0px_0px_1px_rgba(0,85,255,0.15)]"
          >
            {isLoggedIn ? "Dashboard" : "Create your AI"}
          </a> */}
          <a
            onClick={onLogin}
            className="cursor-pointer relative flex items-center justify-center px-2 py-[2px] 
             text-white text-[15px] leading-[25px] tracking-[-0.5px] 
             bg-[#0055FF] rounded-[10px] border-[2.1px] border-white/15 
             shadow-[0px_8px_40px_rgba(0,85,255,0.5),0px_0px_10px_rgba(255,255,255,0)_inset,0px_0px_0px_1px_rgba(0,85,255,0.12)] 
             transition-all duration-300 
             "
          >
            {/* Create your AI */}
            {isLoggedIn ? "Dashboard" : "Create your AI"}
          </a>

          {/* <div className="bg-white text-black rounded-[80px] py-2 px-3 flex gap-2 text-[16px] items-center justify-center">
          <button onClick={onLogin} className=" text-[10px] md:text-[16px]">
            {isLoggedIn ? "Dashboard" : "Create your AI"}
          </button>
        </div> */}
        </div>
      )}
    </div>
  );
}

export default Navbar;
