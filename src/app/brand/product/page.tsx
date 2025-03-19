import Products from "@/component/marketing/Products";
import React from "react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  return (
    <div>
      <h1 className=" ml-24 text-2xl font-bold py-5  top-0 ">Products</h1>
      <Products />
    </div>
  );
};

export default Page;
