'use client';

import useBrandStore from "@/store/useBrandStore";
import Link from "next/link";
import React, { useState } from "react";

type Props = {};

interface StatusBoxProps {
  imageSrc: string;
  isCompleted: boolean;
}

const StatusBox: React.FC<StatusBoxProps> = ({ imageSrc, isCompleted }) => {
  console.log(imageSrc);
  
  return (
    <div className="flex w-[50vw] items-center justify-between p-4 bg-[grey]/5 rounded-2xl shadow-md mt-6">
      <div className="flex items-center">
        <img
          src={imageSrc}
          alt="Brand logo"
          className="w-10 h-10 object-cover rounded-full"
        />
      </div>
      <div
        className={`flex items-center space-x-2 ${
          isCompleted ? "bg-[#126A00]/30" : "bg-[#6A5100]/30"
        } p-3 rounded-2xl`}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isCompleted ? "bg-green-500" : "bg-[#FFAE00]"
          }`}
        />
        <span className={`text-sm `}>
          {isCompleted ? "Completed" : "Status Pending"}
        </span>
      </div>
    </div>
  );
};

function Page({}: Props) {
  // Dynamic brand name and status
  const brandName = useBrandStore((state)=>state.brandName)
  const brandLogo = useBrandStore((state)=>state.logo)
  const [isStatusCompleted, setIsStatusCompleted] = useState(true);


  return (
    <div className="bg-gradient-to-br from-[#1E60FB]/15 to-[#000000]  bg-[length:100%_87%_0%] min-h-screen flex items-center justify-center">
      <div className="bg-authCard/50 p-14 rounded-xl shadow-xl gap-10">
        {/* Heading */}
        <div className="mb-16 ">
          <h1 className="text-3xl mb-8 font-semibold text-white text-center ">
            👋 Hello {brandName} team!
          </h1>
          <h2 className="text-xl text-center mt-2">
            Welcome to smart ads, waiting for the approval.
          </h2>
          <p className="text-xl text-center mt-2">
            This typically takes 1-2 working days.
          </p>
        </div>
        {/* Status Box */}
        <StatusBox
          imageSrc={brandLogo} // Replace with dynamic image link if needed
          isCompleted={isStatusCompleted}
        />

        {/* Button to navigate */}
        <div className="mt-10 flex items-center justify-center">
          <Link
            className="bg-[#00AFFE] px-5 py-3 rounded-xl flex justify-center items-center z-50"
            href="brand/profile"
          >
            lets go 🎉
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
