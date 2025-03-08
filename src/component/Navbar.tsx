import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useRemoveAuthToken from "@/hooks/useRemoveAuthToken";

function Navbar() {
  const router = useRouter();
  const isLoggedIn = useAuth();
  const removeAuthToken = useRemoveAuthToken();

  const onLogin = () => {
    if (isLoggedIn) {
      router.push("/brand/profile");
    } else {
      router.push("/login");
    }
  };

  const onLogout = () => {
    removeAuthToken();
  };

  return (
    <div className="z-[11] flex items-center justify-between w-full p-4 px-4  max-w-screen-2xl sticky top-0  bg-[#0D0D0D] border-b-[#2B2B2B] border-b-2">
      <button>
        <Image
          alt="shoppie"
          src={"/img/SHOPPIE.svg"}
          width={0}
          height={10}
          className="w-[100px] md:w-[150px]"
        />
      </button>
      <div className="flex gap-5">
        <button
          onClick={onLogout}
          className="font-bold text-[10px] md:text-[16px]"
        >
          {isLoggedIn ? "Log out" : ""}
        </button>
        <button className="bg-white text-black rounded-[80px] py-2 px-3 flex gap-2 text-[16px] items-center justify-center">
          <button
            onClick={onLogin}
            className="font-bold text-[10px] md:text-[16px]"
          >
            {isLoggedIn ? "Dashboard" : "Create your AI"}
          </button>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
