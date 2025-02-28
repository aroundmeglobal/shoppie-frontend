// BrandModel.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { Brand } from "@/app/page"; // Adjust the import path as needed
import { MdVerified } from "react-icons/md";
import api from "@/lib/axiosInstance";
import { AiOutlineMessage } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";


interface BrandModelProps {
  brand: Brand;
  onClose: () => void;
  handleBotClick: any;
}

export default function BrandModel({
  brand,
  onClose,
  handleBotClick,
}: BrandModelProps) {
  const [brandDetaile, setBrandDetailes] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [showAllProductModal, setShowAllProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await api.get("/users/brand-details", {
          user_id: 369,
        });
        const data = response.data;
        setBrandDetailes(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProductDetailes = async () => {
      try {
        const response = await api.get(
          "/users/product-details-by-brand?user_id=369"
        );
        const data = response.data;
        setProductDetails(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBrandDetails();
    fetchProductDetailes();
  }, []);

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch (e) {
      return null;
    }
  };

  const getFavicon = (url: string): string => {
    const domain = extractDomain(url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    // Return a fallback image path if domain is null
    return "/aroundImg.png";
  };

  const socialLinks = [
    { name: "Facebook", url: brandDetaile?.meta?.facebook },
    { name: "Instagram", url: brandDetaile?.meta?.instagram },
    { name: "LinkedIn", url: brandDetaile?.meta?.linkedin },
    { name: "Twitter", url: brandDetaile?.meta?.x?.twitter },
    { name: "YouTube", url: brandDetaile?.meta?.youtube },
    { name: "Website", url: brandDetaile?.meta?.website },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleSeeAllClick = () => {
    setShowAllProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/50"
      //   onClick={onClose}
    >
      {/* Modal container - clicking inside should not close the modal */}
      <div
        className="relative bg-[#161616] px-10 pt-10 pb-3 w-[80%] h-[80%] mx-4 rounded-3xl overflow-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 p-1 right-5 text-white bg-[#5C5C5C]/40 rounded-full"
          aria-label="Close modal"
        >
          <RxCross2 size={20} />
        </button>
        {/* Modal content */}
        <div className="flex h-full flex-col ">
          <div className="h-[90%] w-full overflow-hidden overflow-y-auto">
            <div className=" rounded-full overflow-hidden flex w-full justify-center">
              <Image
                src={brand.imageUrl}
                alt={brand.name}
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white flex items-center justify-center gap-1">
              {brand.name} <MdVerified color="#1E60FB" size={18} />
            </h2>

            <div className="px-2 py-2">
              <h1 className="text-[#a4a4a4] text-[13px] font-semibold mt-8 font-[BR Firma]">
                Brand Description
              </h1>
              <div className="rounded-xl text-[13px] w-full mt-2 bg-[#1d1d1d] p-[14px] min-h-[55px]">
                <div className=" text-white ">
                  <p>{brandDetaile?.meta?.brand_description}</p>
                </div>
              </div>

              {/* Social Media Links */}
              <h1 className="text-[#fff]/50 text-[14px] font-semibold mt-4">
                Socials
              </h1>
              <div className="rounded-xl mt-2 bg-[#1d1d1d] flex items-center p-[14px] min-h-[55px]">
                {socialLinks.map((link, index) =>
                  link.url ? (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mr-4"
                    >
                      <Image
                        src={getFavicon(link.url)}
                        alt={link.name}
                        width={45}
                        height={45}
                        style={{ borderRadius: 50, backgroundColor: "white" }}
                      />
                    </a>
                  ) : null
                )}
              </div>

              {/* Products and See All Button */}
              <div className="text-[#fff] text-[14px] font-semibold mt-4 flex justify-between items-center">
                <h1>Our Products</h1>
                <button onClick={handleSeeAllClick} className="text-white/80">
                  See All
                </button>
              </div>
              <div className="grid grid-cols-1  md:grid-cols-3 gap-6 mt-4 ">
                {productDetails.slice(0, 3).map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-[#1c1c1c] rounded-xl overflow-hidden "
                    onClick={() => {
                      handleProductClick(product);
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <Image
                        src={product.media[0]}
                        alt={product.title}
                        width={150}
                        height={180}
                        className="w-[100%]"
                      />
                      <div className="px-3 text-[13px] bg-[#2d2d2d] py-2 w-full">
                        <h3 className="text-white  line-clamp-1">
                          {product.title}
                        </h3>
                        <div>
                          <span className="">
                            ₹{product.prices.Discounted_price}
                          </span>
                          <span className=" line-through text-[#a4a4a4] ml-2">
                            ₹{product.prices.Original_price}
                          </span>
                          <span className=" text-[#15CF74] ml-2">
                            {`${Math.round(
                              ((product.prices.Original_price -
                                product.prices.Discounted_price) /
                                product.prices.Original_price) *
                                100
                            )}% Off`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleBotClick(brand)}
            className="flex items-center justify-center gap-2 bg-white w-auto mx-32 mt-4 py-2 px-4 rounded-xl font-semibold text-[#000]"
          >
            <p>Chat with AI</p>
            <div className="bg-[#A4A4A4]/20 p-2 rounded-full">
              <AiOutlineMessage />
            </div>
          </button>
        </div>
      </div>
      {showAllProductModal && (
        <AllProductModal
          handleProductClick={handleProductClick}
          // setSelectedProduct={setSelectedProduct}
          productDetails={productDetails}
          onClose={() => setShowAllProductModal(false)}
        />
      )}
      {showProductModal && (
        <ProductModal
          brand={brand}
          key={selectedProduct?.id}
          selectedProduct={selectedProduct}
          onClose={handleCloseProductModal}
          handleProductClick={handleProductClick}
          handleBotClick={handleBotClick}
          handleSeeAllClick={handleSeeAllClick}
        />
      )}
    </div>
  );
}

const AllProductModal = ({
  productDetails,
  onClose,
  handleProductClick,
}: {
  productDetails: any[];
  onClose: () => void;
  handleProductClick: (product: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search input
  const filteredProducts = productDetails.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed bg-[#161616] px-10 pt-10 pb-3 w-[80%] h-[80%] mx-4 rounded-3xl overflow-hidden overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
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
      <div className="flex justify-center rounded-xl items-center m-4 p-[8px] px-[15px] bg-[#1d1d1d]">
        <IoSearchOutline color="#afafaf" size={22} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
          className="w-full p-2 bg-[#1d1d1d] text-white placeholder:text-[#afafaf] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1  md:grid-cols-3 gap-6 m-4">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            className="bg-[#1c1c1c] rounded-xl overflow-hidden"
            onClick={() => {
              handleProductClick(product);
            }}
          >
            <div className="flex flex-col items-center">
              <Image
                src={product.media[0]}
                alt={product.title}
                width={150}
                height={150}
                className="w-[100%]"
              />
              <div className="px-3 bg-[#2d2d2d] py-2 w-full">
                <h3 className="text-white text-[13px] line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-[13px]">
                  {product.prices?.Discounted_price && (
                    <span className="font-bold">
                      ₹{product.prices.Discounted_price}
                    </span>
                  )}
                  {product.prices?.Original_price && (
                    <span className="text-[13px] line-through text-[#a4a4a4] ml-2">
                      ₹{product.prices.Original_price}
                    </span>
                  )}
                  <span className=" text-[13px] font-medium text-[#15CF74] ml-2">
                    {`${Math.round(
                      ((product.prices.Original_price -
                        product.prices.Discounted_price) /
                        product.prices.Original_price) *
                        100
                    )}% Off`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductModal = ({
  selectedProduct,
  onClose,
  handleProductClick,
  handleBotClick,
  brand,
}: {
  brand: Brand;
  selectedProduct: any;
  onClose: () => void;
  handleBotClick: () => void;
  handleProductClick: (product: any) => void;
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductDetailes = async () => {
      try {
        const response = await api.get(
          "/users/product-details-by-brand?user_id=369"
        );
        const data = response.data;
        setProductDetails(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductDetailes();
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const getFavicon = (url: string) => {
    const domain = extractDomain(url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return null;
  };

  const extractDomain = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace("www.", ""); // Remove 'www.' part from the domain if needed
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <div
      className="fixed bg-[#161616] px-10 pt-10 pb-3 w-[80%]  h-[80%] mx-4 rounded-3xl overflow-hidden overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start w-full mt-3 gap-2">
        <span role="img" aria-label="Back">
          <Image
            onClick={onClose}
            src={"/img/white-back-arrow.svg"}
            alt="Back"
            width={16}
            height={16}
            style={{
              width: "16px",
              height: "16px",
              margin: "10px",
              marginLeft: "-10px",
            }}
          />
        </span>
        <div className="text-[15px] w-full py-4  bg-[#1d1d1d] rounded-xl font-bold flex flex-col gap-[15px] text-white p-2 items-center justify-center">
          <Image
            src={selectedProduct.image_url || selectedProduct?.media[0]}
            alt={selectedProduct.title}
            width={400}
            height={150}
            style={{ borderRadius: 20 }}
          />
        </div>
      </div>
      <div className="rounded-md w-full px-6 py-2">
        <div className="mt-2 text-white ">
          <div className="flex w-full justify-between">
            <div>
              <h3 className="text-[18px] font-bold">{selectedProduct.title}</h3>
              <div className="mt-[5px] text-[13px]">
                {!selectedProduct.prices.Original_price ? (
                  <div>
                    <span className="line-through text-[#a4a4a4] mr-2">
                      {selectedProduct.original_price}
                    </span>
                    <span className="text-green-400">
                      {selectedProduct.discounted_price}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-[18px] font-bold">
                      ₹{selectedProduct.prices.Discounted_price}
                    </span>
                    <span className="line-through text-[15px] font-medium text-[#a4a4a4] ml-2">
                      ₹{selectedProduct.prices.Original_price}
                    </span>
                    <span className=" text-[14.5px] font-medium text-[#15CF74] ml-2">
                      {`${Math.round(
                        ((selectedProduct.prices.Original_price -
                          selectedProduct.prices.Discounted_price) /
                          selectedProduct.prices.Original_price) *
                          100
                      )}% Off`}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => handleBotClick(brand)}
              className="flex items-center justify-center mr-[-20px] gap-2 bg-white w-auto  py-2 px-4 rounded-xl font-semibold text-[#000]"
            >
              <p>Chat with AI</p>
              <div className="bg-[#A4A4A4]/20 p-2 rounded-full">
                <AiOutlineMessage />
              </div>
            </button>
          </div>
          <div className="text-[13px] text-[white]/80 leading-2 mt-3">
            {showFullDescription
              ? selectedProduct.description
              : `${selectedProduct.description.slice(0, 100)}...`}
            <button
              onClick={toggleDescription}
              className={`text-[#1E60FB] ml-[4px]`}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full p-2">
        <h1 className="text-[14px] font-semibold m-4">
          Buy this product through
        </h1>
        <div className="bg-[#1d1d1d] m-4 rounded-xl flex items-center p-[14px] space-x-4">
          {selectedProduct.purchase_urls.map((url, index) => {
            const faviconUrl = getFavicon(url);
            return (
              <a
                target="blank"
                href={url}
                key={index}
                className="rounded-xl overflow-hidden"
              >
                {faviconUrl && (
                  <Image
                    width={40}
                    height={40}
                    src={faviconUrl}
                    alt="Favicon"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Products and See All Button */}
        <div className="text-[#fff] text-[14px] font-semibold m-4 flex justify-between items-center">
          <h1>Similar products</h1>
        </div>
        <div className="flex gap-6 mt-4 ml-4 mb-4 overflow-hidden overflow-x-auto">
          {productDetails.map((product: any) => (
            <button
              key={product.id}
              className="bg-[#1c1c1c] rounded-xl overflow-hidden min-w-[350px]"
              onClick={() => {
                handleProductClick(product);
                console.log("product hit in product model");
              }}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.media[0]}
                  alt={product.title}
                  width={150}
                  height={180}
                  className="w-[100%]"
                />
                <div className="px-3 text-[13px] bg-[#2d2d2d] py-2 w-full">
                  <h3 className="text-white  line-clamp-1">{product.title}</h3>
                  <div>
                    <span className="">₹{product.prices.Discounted_price}</span>
                    <span className=" line-through text-[#a4a4a4] ml-2">
                      ₹{product.prices.Original_price}
                    </span>
                    <span className=" text-[#15CF74] ml-2">
                      {`${Math.round(
                        ((product.prices.Original_price -
                          product.prices.Discounted_price) /
                          product.prices.Original_price) *
                          100
                      )}% Off`}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
