"use client";

import ChatBot from "@/component/ChatBot";
import React, { useState } from "react";

// Interface for brand
interface Brand {
  name: string;
  imageUrl: string;
}

const brands: Brand[] = [
  {
    name: "Muscle Blaze",
    imageUrl: "/muscleblaze.png", // Local image
  },
  {
    name: "Nykaa",
    imageUrl: "/nykaa.png", // Local image
  },
  {
    name: "Cipla",
    imageUrl: "/cipla.png", // Local image
  },
  {
    name: "AroundMe",
    imageUrl: "/aroundImg.png", // Local image
  },
  {
    name: "H&M",
    imageUrl: "/hm.png", // Local image
  },
];

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const handleBrandClick = (brand: Brand) => {
    // Toggle selected brand; if it's the same as the current one, close the chatbot
    if (selectedBrand?.name === brand.name) {
      setSelectedBrand(null);
    } else {
      setSelectedBrand(brand);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between  md:pt-10   mx-auto  md:px-32  max-w-screen-2xl ">
      <div
        style={{
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {brands.map((brand) => (
          <button
            key={brand.name}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              marginBottom: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onClick={() => handleBrandClick(brand)}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                overflow: "hidden",
                position: "relative",
                marginBottom: "10px",
              }}
            >
              <img
                src={brand.imageUrl}
                alt={brand.name}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
            <p style={{ fontSize: "0.9rem", color: "#333", textAlign: "center" }}>
              {brand.name}
            </p>
          </button>
        ))}
      </div>

      {selectedBrand && <ChatBot selectedBrand={selectedBrand} />}
    </main>
  );
}