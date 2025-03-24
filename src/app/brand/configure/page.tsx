"use client";

import React, { useEffect, useState } from "react";
import ConfigureForm from "@/component/marketing/form/ConfigureForm";
import BrandGeneralIntelligneceChat from "@/component/marketing/BrandGeneralIntelligneceChat";

import useBrandStore from "@/store/useBrandStore";
import { GrConfigure } from "react-icons/gr";
import Script from "next/script";

const Page = () => {
  const brandId = useBrandStore((state) => state.brandId);
  const workspaceExist = useBrandStore((state) => state.workspaceExists);
  const embedId = useBrandStore((state) => state.embedId);

  return (
    <div>
      {/* Main content container */}
      <div className="ml-20 px-5 overflow-y-auto h-screen bg-[#000] ">
        <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
          Configure widget
        </h1>
        <div className="w-full h-[85%] gap-5 mt-8 flex items-center justify-center  no-scrollbar ">
          <div className="w-3/4 h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar  pb-5">
            <ConfigureForm />
          </div>

          <div className="w-2/4 h-full bg-[#161616]  bg-transparent rounded-xl overflow-hidden  ">
            {workspaceExist ? (
              embedId && (
                <Script
                  data-embed-id={embedId}
                  data-base-api-url="https://anythingllm.aroundme.global/api/embed"
                  dataset-open-on-load="on"
                  src="https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js"
                />
              )
            ) : (
              // <BrandGeneralIntelligneceChat />
              // <div></div>
              <div className="flex items-center flex-col gap-10 w-full h-full justify-center bg-[#161616]">
                <h1 className="text-3xl font-bold mt-[-10vh] text-center">
                  Configure your brand to start using bot
                </h1>
                <GrConfigure size={200} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
