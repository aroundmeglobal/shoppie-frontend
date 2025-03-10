"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import api from "@/lib/axiosInstance";
import { percentageDifference } from "@/lib/price";
import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import Spinner from "@/component/Spinner";

interface PageProps {
  params: {
    id: string;
  };
}
export default function Page({ params }: PageProps) {
  const router = useRouter();
  const brandId = params.id;
  const [searchTerm, setSearchTerm] = useState("");

  const getBrandDetails = async () => {
    const response = await api.get(`/brands/${brandId}`);
    return response.data;
  };

  const fetchSocialDetails = async () => {
    const response = await api.get(`/social/brand-social/${brandId}`);
    return response.data;
  };

  const fetchProductDetails = async () => {
    const response = await api.get("/files/", {
      params: {
        brand_id: brandId || "",
      },
    });
    return response.data;
  };

  const [
    { data: brandDetails, isLoading: isBrandLoading, error: brandError },
    { data: socialDetails, isLoading: isSocialLoading, error: socialError },
    { data: productDetails, isLoading: isProductLoading, error: productError },
  ] = useQueries({
    queries: [
      {
        queryKey: ["brand-details"],
        queryFn: getBrandDetails,
        enabled: !!brandId,
      },
      {
        queryKey: ["social-details"],
        queryFn: fetchSocialDetails,
        enabled: !!brandId,
      },
      {
        queryKey: ["product-details"],
        queryFn: fetchProductDetails,
        enabled: !!brandId,
      },
    ],
  });

  const onClose = () => {
    router.back();
  };

  if (isBrandLoading || isSocialLoading || isProductLoading) {
    return <Spinner />;
  }

  if (brandError || socialError || productError) {
    return (
      <div className="flex justify-center items-center h-screen">
        {brandError?.message || socialError?.message || productError?.message}
      </div>
    );
  }

  const filteredProducts = productDetails?.filter((product) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between md:justify-between items-center ">
        <div className="text-[15px] font-bold flex flex-1 items-center gap-[15px] text-white py-2.5">
          <span role="img" aria-label="Back" onClick={onClose}>
            <Image
              src={"/img/white-back-arrow.svg"}
              alt="Back"
              width={16}
              height={16}
              style={{
                width: "16px",
                height: "16px",
                marginLeft: "10px",
              }}
            />
          </span>
          <div className="flex flex-1 justify-center">
            <div className=" ml-[-50px] text-[16px] flex flex-col gap-2 items-center">
              All products
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center rounded-xl items-center m-4 p-[4px] px-[15px] bg-[#1d1d1d]">
        <IoSearchOutline color="#afafaf" size={22} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
          className="w-full p-2 bg-[#1d1d1d] text-white placeholder:text-[#afafaf] focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-6 m-4">
        {filteredProducts?.map((product: any) => (
          <Link
            href={{
              pathname: `/chat/product/${product.id}`,
              query: {
                brand_id: brandId,
                product_name: product.product_name,
                product_description: product.product_description,
                product_images: product.product_images[0],
                original_price: product.product_prices?.Original_price,
                discounted_price: product.product_prices?.Discounted_price,
                tags: product.tags.join(","),
                purchase_link: product.purchase_link.join(","),
              },
            }}
            passHref
            key={product.id}
            className="bg-[#1c1c1c] rounded-xl overflow-hidden pb-2"
          >
            <div className="flex flex-col items-center">
              <Image
                src={product.product_images[0]}
                alt={product.product_name}
                width={100}
                height={48}
                className="w-full h-[180px] object-contain rounded-xl rounded-b-none bg-white"
              />
              <div className="mx-3  flex flex-col justify-between  gap-2 flex-grow  text-start ">
                <h3 className=" pt-2 font-medium text-[13px] line-clamp-2 md:line-clamp-2 ">
                  {product.product_name}
                </h3>
                <div className="flex-col gap-1 flex">
                  <h3 className="text-md ">
                    {product.product_prices.Discounted_price}
                  </h3>
                  <h3 className="line-through text-sm text-[grey]/90">
                    {product.product_prices.Original_price}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
