"use client";

import {
  fetchTotalFirstMessagesData,
  fetchTotalSentMessagesData,
  fetchTotalWidgetTapsData,
  fetchUniqueViewData,
} from "@/api/getBrandAnalysis";
import useBrandStore from "@/store/useBrandStore";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { LuRefreshCw } from "react-icons/lu";
import { MdDateRange } from "react-icons/md";

const cardsData = [
  {
    title: "Unique views",
    no: 155,
    description: "Unique visitors who interacted with your AI chatbot.",
  },
  {
    title: "Number of taps",
    no: 250,
    description: "Total user interactions with the chatbot.",
  },
  {
    title: "Conversations started",
    no: 155,
    description: "Users who initiated a chat with your AI.",
  },
  {
    title: "Number of Messages",
    no: `2.2K`,
    description: "Total messages exchanged between users and your bot.",
  },
  {
    title: "Average message per conversation",
    no: 75,
    description: "The average number of messages per chat.",
  },
];

const productsData = [
  {
    title: "Product 1",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 1",
    taps: 155,
  },
  {
    title: "Product 2",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 2",
    taps: 250,
  },
  {
    title: "Product 3",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 3",
    taps: 155,
  },
  {
    title: "Product 4",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 4",
    taps: 220,
  },
  {
    title: "Product 5",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 5",
    taps: 180,
  },
  {
    title: "Product 6",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 6",
    taps: 300,
  },
  {
    title: "Product 7",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 7",
    taps: 120,
  },
  {
    title: "Product 8",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 8",
    taps: 210,
  },
  {
    title: "Product 9",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 9",
    taps: 270,
  },
  {
    title: "Product 10",
    image:
      "https://img3.hkrtcdn.com/27426/prd_2742542-MuscleBlaze-Biozyme-Performance-Whey-4.4-lb-Rich-Chocolate_o.jpg",
    description: "This is the description for Product 10",
    taps: 400,
  },
];

const Page = () => {
  const sortedProducts = productsData.sort((a, b) => b.taps - a.taps);
  const brandId = useBrandStore((state) => state.brandId);

  const {
    data: uniqueViewData,
    isLoading: isLoadingUniqueView,
    error: errorUniqueView,
  } = useQuery({
    queryKey: ["uniqueView", brandId],
    queryFn: () => fetchUniqueViewData(brandId),
    enabled: !!brandId,
  });

  const {
    data: totalSentMessagesData,
    isLoading: isLoadingSentMessages,
    error: errorSentMessages,
  } = useQuery({
    queryKey: ["totalSentMessages", brandId],
    queryFn: () => fetchTotalSentMessagesData(brandId),
    enabled: !!brandId,
  });

  const {
    data: totalFirstMessagesData,
    isLoading: isLoadingFirstMessages,
    error: errorFirstMessages,
  } = useQuery({
    queryKey: ["totalFirstMessages", brandId],
    queryFn: () => fetchTotalFirstMessagesData(brandId),
    enabled: !!brandId,
  });

  const {
    data: totalWidgetTapsData,
    isLoading: isLoadingWidgetTaps,
    error: errorWidgetTaps,
  } = useQuery({
    queryKey: ["totalWidgetTaps", brandId],
    queryFn: () => fetchTotalWidgetTapsData(brandId),
    enabled: !!brandId,
  });

  console.log("uniqueViewData", uniqueViewData);
  console.log("totalSentMessagesData", totalSentMessagesData);
  console.log("totalFirstMessagesData", totalFirstMessagesData);
  console.log("totalWidgetTapsData", totalWidgetTapsData);

  return (
    <div className="ml-20 px-5  h-screen ">
      <div className="border-b-2 flex justify-between items-center top-0 sticky bg-[#000]">
        <h1 className="text-2xl font-bold py-5 sticky top-0  ">Analytics</h1>
        <div className="flex gap-5 items-center">
          <div className="flex gap-2 items-center text-base">
            Updated just now{" "}
            <div className="bg-[#1C1C1D] p-4 rounded-xl border-[1px]">
              <LuRefreshCw />
            </div>
          </div>
          <div className="flex gap-2 items-center bg-[#1C1C1D] p-3 rounded-xl border-[1px]">
            date <MdDateRange />
          </div>
        </div>
      </div>
      <div className="w-full gap-6 mt-8 flex flex-wrap justify-start no-scrollbar ">
        {cardsData.map((card) => (
          <div
            key={Math.random()}
            className="w-1/3 h-[180px] max-w-[calc(33.333%-1.25rem)] bg-[#161616] flex flex-col justify-between  p-4 rounded-xl shadow-md"
          >
            <h3 className="text-xl ">{card.title}</h3>
            <p className="text-5xl font-medium mb-[-15px]">{card.no}</p>
            <p className="text-sm">{card.description}</p>
          </div>
        ))}
        <div className="w-full h-full bg-[#161616] rounded-xl">
          {/* Heading section */}
          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-semibold">Product taps</h2>
            <span className="text-sm ">Sorted by Highest</span>
          </div>

          {/* Product list */}
          {sortedProducts.map((product) => (
            <div
              key={product.title}
              className="w-full flex justify-between items-center p-4 rounded-xl shadow-md"
            >
              {/* Image and details on left */}
              <div className="flex">
                <div className="flex items-center justify-center w-[78px] h-[73px] px-2 py-3 bg-[#2d2d2d] rounded-xl">
                  <img
                    src={product.image}
                    alt={product.title}
                    className=" object-cover rounded-xl"
                  />
                </div>
                <div className="ml-4 flex flex-col mt-2 gap-3">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-white">
                    {product.title}
                  </h3>
                  {/* Description */}
                  <p className="text-sm text-[#A4a4a4]">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Number of taps on the right */}
              <div className="flex items-baseline gap-2 justify-center text-2xl font-medium text-white">
                {product.taps} <span className="text-sm">taps</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
