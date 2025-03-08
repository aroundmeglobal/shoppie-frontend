"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Image from "next/image";
import uploadProducts from "@/lib/uploadProducts";
import useBrandStore from "@/store/useBrandStore";
import { ClipLoader } from "react-spinners";
import api from "@/lib/axiosInstance";

// Define the product type based on your CSV structure.
type Product = {
  product_name: string;
  product_images: string;
  product_description: string;
  original_price: string;
  discounted_price: string;
  tags: string[];
  purchase_link: string;
};

type OldProduct = {
  product_name: string;
  product_description: string;
  product_images: string;
  product_prices: { Original_price: string; Discounted_price: string };
  tags: string[];
  purchase_link: string;
};

// Component to display an individual product card.
const ProductCard = ({ product }: { product: Product }) => {
  const url = new URL(product?.purchase_link);
  const domain = url.hostname;
  return (
    <div className="border p-4 rounded-xl bg-[#161616] text-yellow-50 flex flex-col h-full">
      <Image
        src={product.product_images}
        alt={product.product_name}
        width={100}
        height={48}
        className="w-full h-48 object-cover rounded-xl"
      />
      <h2 className="font-semibold text-xl mt-2">{product.product_name}</h2>
      <p className="text-sm mt-1 line-clamp-3 text-[whitesmoke] opacity-55">
        {product.product_description}
      </p>
      <p className="mt-4">
        <span className="line-through mr-2 text-[whitesmoke] opacity-65">
          ₹{product.original_price}
        </span>
        <span className="text-green-400">₹{product.discounted_price}</span>
      </p>

      {/* Using Flexbox for Tags */}
      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-2">
        {product.tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-[#1d1d1d] border-[#2d2d2d] border-[2px] px-[6px] py-[3px] text-[12px] rounded whitespace-no-wrap max-w-fit break-all"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Purchase Links */}
      <div className="mt-2 ml-1 flex gap-x-[8px] justify-start items-center">
        <a
          href={product.purchase_link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-[2px] border-[#2d2d2d] overflow-hidden"
        >
          <Image
            src={`https://www.google.com/s2/favicons?domain=${domain}`}
            alt={`Favicon for ${domain}`}
            width={30}
            height={30}
          />
        </a>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const brandName = useBrandStore((state) => state.brandName);
  const brandId = useBrandStore((state) => state.brandId);
  const [oldProducts, setOldProducts] = useState<OldProduct[]>([]);

  useEffect(() => {
    const fetchOldProducts = async () => {
      const responseOldProducts = await api.get(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/?brand_id=${brandId}`
      );
      console.log("responseOldProducts", responseOldProducts.data);
      setOldProducts(responseOldProducts.data);
    };

    fetchOldProducts();
  }, []);

  const renderOldProducts = oldProducts.map((product, index) => {
    return (
      <ProductCard
        key={index}
        product={{
          product_name: product.product_name || "Unknown Product",
          product_description:
            product.product_description || "No description available",
          product_images: product.product_images[0] || "",
          original_price: product.product_prices?.Original_price || "N/A",
          discounted_price: product.product_prices?.Discounted_price || "N/A",
          tags: product.tags || [],
          purchase_link: product.purchase_link || "",
        }}
      />
    );
  });

  // Handler for CSV file upload.
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as any[];
          const parsedProducts: Product[] = data.map((row) => {
            return {
              product_name: row.Product_name,
              product_images: row.Product_images,
              product_description: row.Product_description,
              original_price: row.Original_price,
              discounted_price: row.Discounted_price,
              tags: row.Tags
                ? row.Tags.split(",").map((tag: string) => tag.trim())
                : [],
              purchase_link: row.Purchase_link,
            };
          });

          setProducts(parsedProducts);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
        },
      });
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDiscard = () => {
    setUploadedFile(null);
    setProducts([]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!uploadedFile) {
      alert("Please upload a CSV file first!");
      setLoading(false);
      return;
    }

    // upload to cdn

    console.log(uploadedFile);

    const uploadFileType = uploadedFile.type;
    console.log("uploadFileType", uploadFileType);

    const productResponse = await fetch(
      `https://fastapi.aroundme.tech/api/upload/generate-upload-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${brandName.replace(/\s+/g, "-").toLowerCase()}-product`,
          type: `${uploadedFile.type}`,
          asset_for: "user-products",
        }),
      }
    );

    const productData = await productResponse.json();

    await fetch(productData.signed_url, {
      method: "PUT",
      headers: {
        "Content-Type": uploadedFile.type,
      },
      body: uploadedFile,
    });

    console.log("productData", productData.public_url);

    //hit file upload api

    const body = {
      brand_id: brandId,
      file: `${productData.public_url}`,
    };
    const responseFileUpload = await api.post(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/files/upload-products`,
      body
    );

    console.log("file upload", responseFileUpload);

    // hit brand update with empty json

    const brandBody = {};
    const responseUpdateBrand = await api.put(
      `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/?brand_id=${brandId}`,
      brandBody
    );

    console.log("brand updated", responseUpdateBrand);

    setLoading(false);
  };

  return (
    <div className="p-5 pt-0 overflow-y-auto h-full">
      {loading && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <ClipLoader color="white" loading={loading} size={50} />
        </div>
      )}
      <div className="flex flex-col mt-3 px-28 gap-10 overflow-hidden">
        {/* Box Container */}
        {!uploadedFile ? (
          <div className="rounded-xl p-6 bg-[#161616] shadow">
            {/* Heading */}
            <h2 className="text-2xl font-bold mb-2">
              Add your products to showcase on profile
            </h2>
            {/* Subheading */}
            <p className="mb-4 text-[#fff]/60">
              Let your customer explore and make informed decision
            </p>
            {/* Buttons */}
            <div className="flex space-x-4 mt-16">
              {/* Import CSV Button */}
              <button
                onClick={() => document.getElementById("csvInput")?.click()}
                className="flex items-center justify-between bg-white border text-gray-800 px-4 py-2 rounded-xl hover:bg-[#3d3d3d] hover:text-white focus:border-[#4d4d4d]"
              >
                <span className="font-semibold">Import CSV</span>
                {/* Upload icon at right */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4-4 4M12 4v12"
                  />
                </svg>
              </button>
              <input
                type="file"
                id="csvInput"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              {/* Add Products Button */}
              <Link
                href={"/brand/add-product"}
                className="flex items-center justify-between border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d]"
              >
                <span>Add Products</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center bg-[#161616] p-4 rounded-xl">
            <span className="text-white">{uploadedFile.name}</span>
            <div className="flex items-center gap-5 pt-2">
              <button
                className={`mt-[-10px] cursor-pointer flex items-center justify-between flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d]  hover:bg-[red]/30 hover:border-[red]/60`}
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                className={`py-2 px-4 mt-[-10px] rounded-2xl ${
                  uploadedFile
                    ? "cursor-pointer bg-[#00AFFE]"
                    : `cursor-not-allowed flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d] `
                }`}
                onClick={handleSubmit}
                disabled={!uploadedFile}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Render CSV products if available */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      {/* if products exist */}
      <div className="flex flex-col mt-3 px-28 gap-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderOldProducts} {/* Display old products here */}
        </div>
      </div>
    </div>
  );
};

export default Products;
