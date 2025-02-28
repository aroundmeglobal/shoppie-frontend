// "use client";

// import ChatBot from "@/component/ChatBot";
// import Navbar from "@/component/Navbar";
// import React, { useState } from "react";

// // Interface for brand
// interface Brand {
//   name: string;
//   imageUrl: string;
// }

// const brands: Brand[] = [
//   {
//     name: "Muscle Blaze",
//     imageUrl: "/muscleblaze.png", // Local image
//   },
//   {
//     name: "Nykaa",
//     imageUrl: "/nykaa.png", // Local image
//   },
//   {
//     name: "Cipla",
//     imageUrl: "/cipla.png", // Local image
//   },
//   {
//     name: "AroundMe",
//     imageUrl: "/aroundImg.png", //
//     //  Local image
//   },
//   {
//     name: "H&M",
//     imageUrl: "/hm.png", // Local image
//   },
// ];

// export default function Home() {
//   const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

//   const handleBrandClick = (brand: Brand) => {
//     // Toggle selected brand; if it's the same as the current one, close the chatbot
//     if (selectedBrand?.name === brand.name) {
//       setSelectedBrand(null);
//     } else {
//       setSelectedBrand(brand);
//     }
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center max-w-screen-2xl bg-[#0d0d0d]">
//       <Navbar />
//       <div className="mt-10 text-6xl font-bold text-center leading-relaxed font-[AbhayLibre]">
//         <h1 >Lorem ipsum is typically a corrupted</h1>
//         <h1> version of De finibus </h1>
//       </div>

//       {/* search bar  */}

//       {/* few tags  */}
//     </main>
//   );
// }

// {/* <div
//         style={{
//           borderRight: "1px solid #ccc",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           padding: "1rem",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           height: "100vh",
//           overflowY: "auto",
//         }}
//       >
//         {brands.map((brand) => (
//           <button
//             key={brand.name}
//             style={{
//               border: "none",
//               background: "transparent",
//               cursor: "pointer",
//               marginBottom: "1rem",
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//             }}
//             onClick={() => handleBrandClick(brand)}
//           >
//             <div
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 borderRadius: "50%",
//                 overflow: "hidden",
//                 position: "relative",
//                 marginBottom: "10px",
//               }}
//             >
//               <img
//                 src={brand.imageUrl}
//                 alt={brand.name}
//                 style={{ objectFit: "contain", width: "100%", height: "100%" }}
//               />
//             </div>
//             <p
//               style={{ fontSize: "0.9rem", color: "#333", textAlign: "center" }}
//             >
//               {brand.name}
//             </p>
//           </button>
//         ))}
//       </div>
//         {selectedBrand && <ChatBot selectedBrand={selectedBrand} />} */}

"use client";

import ChatBot from "@/component/ChatBot";
import Navbar from "@/component/Navbar";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Image from "next/image";
import { AiOutlineMessage } from "react-icons/ai";

// Interface for brand
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
    tags: ["Ecommerce", "Food and Beverage", "Clothing"],
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
    tags: ["Ecommerce", "Food and Beverage"],
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
  "Food and Beverage",
];

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleTagClick = (tag: string) => {
    // Set only the selected tag
    setSelectedTag(tag);
  };

  useEffect(() => {
    if (selectedBrand) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Cleanup when component unmounts or when selectedBrand changes
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBrand]);

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

  return (
    <main className="flex pb-5 flex-col items-center max-w-screen-2xl bg-[#0d0d0d]">
      <Navbar />

      <div className="mt-16 text-6xl font-bold text-center leading-relaxed font-[AbhayLibre]">
        <h1>Lorem ipsum is typically a corrupted</h1>
        <h1>version of De finibus</h1>
      </div>

      {/* Search Bar */}
      <div className="mt-16 items-center px-4 py-2 flex justify-center w-[80%] bg-[#121212 ] rounded-[40px] overflow-hidden border-2 border-[#333333]">
        <IoSearchOutline color="#afafaf" size={34} />
        <input
          type="text"
          placeholder="Search here..."
          className="p-3 text-lg rounded-lg w-full  bg-transparent  focus:outline-none  placeholder:text-[#afafaf]"
        />
      </div>

      {/* Tags Section */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
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
      <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full px-10">
        {filteredBrands.map((brand, index) => (
          <div
            key={index}
            className="rounded-3xl p-6 shadow-xl flex flex-col items-center text-center border-[1px] border-[#1d1d1d] "
          >
            <div className="h-[120px] w-[120px] rounded-full overflow-hidden mb-2">
              <Image
                width={120}
                height={120}
                src={brand.imageUrl}
                alt={brand.name}
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{brand.name}</h2>
            <p className="text-[#A4A4A4] text-sm line-clamp-2 px-4 mt-2">
              {brand.description}
            </p>
            <div className="flex items-center justify-center bg-[#171717]/90 mt-4 py-2 px-4 rounded-xl">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className={`h-[32px] w-[32px] rounded-full overflow-hidden ${
                    idx > 0 ? "ml-[-8px]" : ""
                  }
                  ${idx === 0 ? "z-30" : idx === 1 ? "z-20" : "z-10"}
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
              <p className="text-[#A4A4A4] text-[14px]">+182 interactions</p>
            </div>
            <button
              onClick={() => handleBrandClick(brand)}
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
  );
}
