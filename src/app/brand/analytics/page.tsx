"use client";

import {
  fetchTotalFirstMessagesData,
  fetchTotalSentMessagesData,
  fetchTotalWidgetTapsData,
  fetchUniqueViewData,
  getAverage,
  getProducts,
  getProductTaps,
} from "@/api/getBrandAnalysis";
import useBrandStore from "@/store/useBrandStore";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { MdDateRange } from "react-icons/md";
import { formatDistance } from "date-fns";
import Counter from "@/component/Counter";

const Page = () => {
  const brandId = useBrandStore((state) => state.brandId);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | string | null>(null);

  const {
    data: uniqueViewData,
    isLoading: isLoadingUniqueView,
    error: errorUniqueView,
    refetch: uniqueViewDataRefetch,
  } = useQuery({
    queryKey: ["uniqueView", brandId],
    queryFn: () => fetchUniqueViewData(brandId),
    enabled: !!brandId,
  });

  const {
    data: totalSentMessagesData,
    isLoading: isLoadingSentMessages,
    error: errorSentMessages,
    refetch: totalSentMessageDataRefetch,
  } = useQuery({
    queryKey: ["totalSentMessages", brandId],
    queryFn: () => fetchTotalSentMessagesData(brandId),
    enabled: !!brandId,
  });

  const {
    data: totalFirstMessagesData,
    isLoading: isLoadingFirstMessages,
    error: errorFirstMessages,
    refetch: totalFirstMessageDataRefetch,
  } = useQuery({
    queryKey: ["totalFirstMessages", brandId],
    queryFn: () => fetchTotalFirstMessagesData(brandId),
    enabled: !!brandId,
  });

  const {
    data: totalWidgetTapsData,
    isLoading: isLoadingWidgetTaps,
    error: errorWidgetTaps,
    refetch: totalWidgetTapDataRefetch,
  } = useQuery({
    queryKey: ["totalWidgetTaps", brandId],
    queryFn: () => fetchTotalWidgetTapsData(brandId),
    enabled: !!brandId,
  });

  const {
    data: averageData,
    isLoading: isLoadingAverageData,
    error: errorAverageData,
    refetch: averageDataRefetch,
  } = useQuery({
    queryKey: ["averageData", brandId],
    queryFn: () => getAverage(brandId),
    enabled: !!brandId,
  });

  const {
    data: productTitlesWithTaps,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["productTaps", brandId],
    queryFn: () => getProductTaps(brandId),
    enabled: !!brandId,
  });

  const {
    data: products,
    isLoading: productsLoading,
    error: productError,
  } = useQuery({
    queryKey: ["products", brandId],
    queryFn: () => getProducts(brandId, productTitlesWithTaps),
    enabled: !!productTitlesWithTaps,
  });

  const cardsData = useMemo(
    () => [
      {
        title: "Unique views",
        no: errorUniqueView ? 0 : uniqueViewData || 0,
        description: "Unique visitors who interacted with your AI chatbot.",
      },
      {
        title: "Number of taps",
        no: errorWidgetTaps ? 0 : totalWidgetTapsData || 0,
        description: "Total user interactions with the chatbot.",
      },
      {
        title: "Conversations started",
        no: errorFirstMessages ? 0 : totalFirstMessagesData || 0,
        description: "Users who initiated a chat with your AI.",
      },
      {
        title: "Number of Messages",
        no: errorSentMessages ? 0 : totalSentMessagesData || 0,
        description: "Total messages exchanged between users and your bot.",
      },
      {
        title: "Average message per conversation",
        no: errorAverageData ? 0 : averageData || 0,
        description: "The average number of messages per chat.",
      },
    ],
    [
      uniqueViewData,
      totalWidgetTapsData,
      totalFirstMessagesData,
      totalSentMessagesData,
      averageData,
      brandId,
    ]
  );

  console.log(isLoadingUniqueView, "123123");

  async function handleRefresh() {
    setRefreshing(true);
    await Promise.all([
      uniqueViewDataRefetch(),
      totalSentMessageDataRefetch(),
      totalFirstMessageDataRefetch(),
      totalWidgetTapDataRefetch(),
      averageDataRefetch(),
    ]);
    const now = new Date();
    setLastRefresh("now");
    localStorage.setItem(`last-refresh-${brandId}`, now.toISOString());
    setRefreshing(false);
  }

  useEffect(() => {
    if (!brandId) return;
    const storedTime = localStorage.getItem(`last-refresh-${brandId}`);
    if (storedTime) {
      setLastRefresh(new Date(storedTime));
    }
  }, [brandId]);

  return (
    <div className="ml-20 px-5  h-screen ">
      <div className="border-b-2 flex justify-between items-center top-0 sticky bg-[#000]">
        <h1 className="text-2xl font-bold py-5 sticky top-0  ">Analytics</h1>
        <div className="flex gap-5 items-center">
          <div className="flex gap-2 items-center text-base">
            {lastRefresh === "now"
              ? "now"
              : lastRefresh
              ? formatDistance(lastRefresh, new Date(), { addSuffix: true })
              : null}

            <button
              type="button"
              className="bg-[#1C1C1D] p-4 rounded-xl border-[1px] cursor-pointer"
              onClick={handleRefresh}
            >
              <LuRefreshCw
                className={refreshing ? "animate-spin" : "animate-none"}
              />
            </button>
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
              <Counter endNumber={card.no} />
              {/* <p className="text-5xl font-medium mb-[-15px]">{card.no}</p> */}

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
          {products?.map((product) => (
            <div
              key={product.product_name}
              className="w-full flex justify-between items-center p-4 rounded-xl shadow-md"
            >
              {/* Image and details on left */}
              <div className="flex">
                <div className="flex items-center justify-center w-[78px] h-[73px] px-2 py-3 bg-[#2d2d2d] rounded-xl">
                  <img
                    src={product.product_images[0]}
                    alt={product.product_name}
                    className=" object-cover rounded-xl"
                  />
                </div>
                <div className="ml-4 flex flex-col mt-2 gap-3">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-white">
                    {product.product_name}
                  </h3>
                  {/* Description */}
                  <p className="text-sm text-[#A4a4a4]">
                    {product.product_description}
                  </p>
                </div>
              </div>

              {/* Number of taps on the right */}
              <div className="flex items-baseline gap-2 justify-center text-2xl font-medium text-white">
                {productTitlesWithTaps[product.product_name]}{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
