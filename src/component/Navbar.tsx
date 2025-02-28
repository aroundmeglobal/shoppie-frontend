import React from "react";


function Navbar() {
  return (
    <div className="flex items-center justify-between w-full p-4 px-4  max-w-screen-2xl sticky top-0 z-20 bg-[#0D0D0D] border-b-[#2B2B2B] border-b-2">
      <button>logo</button>
      <div className="flex gap-5 ">
        <button className="font-bold">sign up</button>
        <button className="bg-white text-black rounded-[80px] py-2 px-3 flex gap-2 text-[16px] items-center justify-center">
          <div className="font-bold">Create your AI</div>
          <div className="bg-[#0D0D0D]/10 rounded-full px-[8px] items-center justify-center text-[#0D0D0D]">
            +
          </div>
        </button>
      </div>
    </div>
  );
}

export default Navbar;
