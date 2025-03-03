'use client'

import EditProfile from "@/component/marketing/EditProfile";
import Products from "@/component/marketing/Products";
import React, { useState } from "react";

type Props = {};

const Page = (props: Props) => {
  // 'profile' is the default view
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <h1 className="text-2xl font-bold ml-20 p-5">Brand Profile Screen</h1>
      {/* Sub-heading tabs */}
      <div className="flex space-x-4 ml-28 border-b-2 ">
        <button
          className={`px-4 py-2 ${
            activeTab === "profile" ? "font-bold text-blue-500 border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "product" ? "font-bold text-blue-500 border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("product")}
        >
          Product
        </button>
      </div>
      {/* Conditionally render the component based on activeTab */}
      <div className="ml-20 mt-5 overflow-y-auto h-[85vh] no-scrollbar">
        {activeTab === "profile" && <EditProfile />}
        {activeTab === "product" && <Products />}
      </div>
    </div>
  );
};

export default Page;
