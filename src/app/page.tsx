"use client";

import ChatBot from "@/component/ChatBot";
import Navbar from "@/component/Navbar";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import { AiOutlineMessage } from "react-icons/ai";
import BrandModel from "@/component/BrandModel";
import { useRouter } from "next/navigation";
import useBrandStore from "@/store/selectedBrand";

export interface Brand {
  name: string;
  imageUrl: string;
  description: string;
  tags: string[];
}

const brands: Brand[] = [
  {
    name: "Muscle Blaze",
    imageUrl: "/muscleblaze.png", // Local image
    description:
      "Muscle Blaze is a leading sports nutrition brand offering premium supplements for athletes and fitness enthusiasts.",
    tags: ["Ecommerce", "Food", "Clothing"],
  },
  {
    name: "Nykaa",
    imageUrl: "/nykaa.png", // Local image
    description:
      "Nykaa is a popular beauty and wellness brand providing a wide range of cosmetics, skincare, and haircare products.",
    tags: ["Ecommerce", "Clothing"],
  },
  {
    name: "Cipla",
    imageUrl: "/cipla.png", // Local image
    description:
      "Cipla is a global pharmaceutical company focused on providing affordable medicine to improve health and well-being.",
    tags: ["Ecommerce", "Food"],
  },
  {
    name: "AroundMe",
    imageUrl: "/aroundImg.png", // Local image
    description:
      "AroundMe connects people nearby for spontaneous activities, discussions, and assistance with shared interests.",
    tags: ["Ecommerce", "Electronics"],
  },
  {
    name: "H&M",
    imageUrl: "/hm.png", // Local image
    description:
      "H&M is a multinational clothing retail brand offering trendy fashion at affordable prices for men, women, and children.",
    tags: ["Clothing"],
  },
];

const tags = [
  "All",
  "Clothing",
  "Ecommerce",
  "Electronics",
  "Food",
];

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [brandOverview, setBrandOverview] = useState<Brand | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const setBrand = useBrandStore((state) => state.setBrand);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTagClick = (tag: string) => {
    // Set only the selected tag
    setSelectedTag(tag);
  };

  // Filter brands based on selected tag
  const filteredBrands = brands.filter(
    (brand) => selectedTag === "All" || brand.tags.includes(selectedTag)
  );

  const handleBrandClick = (brand: Brand) => {
    // Toggle selected brand; if it's the same as the current one, close the chatbot
    if (selectedBrand?.name === brand.name) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brand);
    }
  };

  const handleBotClick = (brand: Brand) => {
    if (isMobile) {
      setBrand(brand);
      router.push("/brand/chat/369");
    } else {
      handleBrandClick(brand);
    }
  };

  const handleBrandOverview = (brand: Brand) => {
    setBrand(brand);
    if (isMobile) {
      router.push("/brand-page");
    } else {
      setBrandOverview(brand);
    }
  };

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between  mx-auto  max-w-screen-2xl ">
        <Navbar />

        <div className="mt-5 md:mt-16 text-4xl md:text-6xl font-bold text-center leading-relaxed font-[AbhayLibre]">
          <h1>Shop smarter, not harder!</h1>
        </div>

        {/* Search Bar */}
        <div className="mt-5 md:mt-16 items-center px-4 flex justify-center w-[90%]  md:w-[80%] bg-[#121212] rounded-[12px] md:rounded-[43px] overflow-hidden border-[1px] md:border-2 border-[#333333]">
          <IoSearchOutline color="#afafaf" className="w-[16px] h-[16px] md:w-[32px] md:h-[32px]" />
          <input
            type="text"
            placeholder="Search here..."
            className="p-3 text-[14px] md:text-lg rounded-lg w-full  bg-transparent  focus:outline-none  placeholder:text-[#afafaf]"
          />
        </div>

        {/* Tags Section */}
        <div className="mt-4 md:mt-8 flex text-[14px] md:text-[18px] px-4 md:justify-center  md:flex-wrap items-center gap-2 md:gap-4 w-full overflow-hidden overflow-x-auto">
          {tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className={`px-6 py-2 rounded-2xl hover:bg-white hover:text-black focus:outline-none ${
                selectedTag === tag
                  ? "bg-white text-black"
                  : "bg-[#121212] text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Brands Section */}
        <div className="mt-4 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10 w-full px-4 md:px-10">
          {filteredBrands.map((brand, index) => (
            <div
              key={index}
              className="rounded-3xl p-2 md:p-6 shadow-xl flex flex-col items-center text-center border-[1px] border-[#1d1d1d] "
            >
              <button
                onClick={() => handleBrandOverview(brand)}
                className="flex flex-col items-center"
              >
                <div className="h-[80px] w-[80px] md:h-[120px] md:w-[120px] rounded-full overflow-hidden mb-2">
                  <Image
                    width={120}
                    height={120}
                    src={brand.imageUrl}
                    alt={brand.name}
                  />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {brand.name}
                </h2>
                <p className="text-[#A4A4A4] text-sm line-clamp-2 px-4 mt-2">
                  {brand.description}
                </p>
                <div className="flex items-center justify-center bg-[#171717]/90 mt-4 py-2 px-4 rounded-xl">
                  {[...Array(3)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-[28px] w-[28px] rounded-full overflow-hidden ${
                        idx > 0 ? "ml-[-8px]" : ""
                      }
                  ${idx === 0 ? "z-[10]" : idx === 1 ? "z-[8]" : "z-[2]"}
                  `}
                    >
                      <Image
                        width={28}
                        height={28}
                        src={brand.imageUrl}
                        alt={brand.name}
                      />
                    </div>
                  ))}
                  <p className="text-[#A4A4A4] text-[14px]">
                    +182 interactions
                  </p>
                </div>
              </button>
              <button
                onClick={() => handleBotClick(brand)}
                className="flex items-center justify-center gap-2 bg-white w-full mt-4 py-2 px-4 rounded-xl font-semibold text-[#000]"
              >
                <p>Chat with AI</p>
                <div className="bg-[#A4A4A4]/20 p-2 rounded-full">
                  <AiOutlineMessage />
                </div>
              </button>
            </div>
          ))}
        </div>

        {selectedBrand && (
          <ChatBot
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />
        )}
      </main>
      {brandOverview && (
        <BrandModel
          brand={brandOverview}
          onClose={() => setBrandOverview(null)}
          handleBotClick={handleBotClick}
        />
      )}
    </div>
  );
}
