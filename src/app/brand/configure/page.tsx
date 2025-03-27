"use client";

import React, { useEffect, useState } from "react";
import ConfigureForm from "@/component/marketing/form/ConfigureForm";

import useBrandStore from "@/store/useBrandStore";
import Image from "next/image";
import { IoMdArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Spinner from "@/component/Spinner";

const Page = () => {
  const brandId = useBrandStore((state) => state.brandId);
  const brandName = useBrandStore((state) => state.brandName);
  const brandLogo = useBrandStore((state) => state.logo);
  const workspaceExist = useBrandStore((state) => state.workspaceExists);

  const embedId = useBrandStore((state) => state.embedId);
  const displayMessage = useBrandStore((state) => state.displayMessage);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceExist) return;
    const existingScript = document.getElementById("chat-widget-script");
    const existingWidgetContainer = document.getElementById(
      "anyhting-all-wrapper"
    );

    if (existingScript) {
      document.body.removeChild(existingScript);
    }

    if (existingWidgetContainer) {
      existingWidgetContainer.remove();
    }

    if (!embedId) return;
    const script = document.createElement("script");
    script.id = "chat-widget-script1";
    script.dataset.embedId = embedId;
    script.src =
      "https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js";
    script.async = true;
    script.dataset.baseApiUrl = "https://anythingllm.aroundme.global/api/embed";
    script.dataset.openOnLoad = "on";
    script.dataset.openingMessage = displayMessage;

    document.body.appendChild(script);

    return () => {
      if (script) {
        document.body.removeChild(script);
      }
      const widgetContainerCleanup = document.getElementById(
        "anyhting-all-wrapper"
      );
      if (widgetContainerCleanup) {
        widgetContainerCleanup.remove();
      }
    };
  }, [embedId, displayMessage, workspaceExist]);

  useEffect(() => {
    const widgetContainerCleanup = document.getElementById(
      "anyhting-all-wrapper"
    );
    if (widgetContainerCleanup) {
      widgetContainerCleanup.remove();
    }
  }, []);

  useEffect(() => {
    if (brandId) {
      setLoading(false);
    }
  }, [brandId]);

  // useEffect(() => {
  //   if (!displayMessage) return;
  //   const pTag = document.getElementById("allm-starting-message");
  //   if (pTag) {
  //     pTag.innerText = displayMessage;
  //   }
  // }, [displayMessage]);

  if (loading) {
    return <Spinner />;
  }
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

          <div className="w-2/4 max-w-[450px]  h-full bg-[#161616]  bg-transparent rounded-2xl overflow-hidden  ">
            {!workspaceExist && (
              <div className=" pb-2 rounded-2xl flex flex-col flex-1 h-full w-full  shadow-[0_2px_10px_rgba(0,0,0,0.5)] bg-[#161616]">
                {/* Header */}

                <div className="flex justify-between md:justify-between items-center p-[10px]  bg-[#222222] rounded-tl-xl">
                  <div className="text-[15px] font-bold flex items-center gap-[15px] text-white p-1">
                    <Image
                      src={
                        brandLogo ||
                        "https://storage.aroundme.global/avatar_default.png"
                      }
                      alt="Chat"
                      width={12}
                      height={12}
                      className="rounded-full w-12 h-12 object-cover cursor-pointer"
                    />
                    <div className="text-white text-lg max-w-[85%] line-clamp-1">
                      {brandName}{" "}
                    </div>
                  </div>
                  <span
                    role="img"
                    aria-label="Back"
                    className="cursor-pointer bg-[#5C5C5C]/50 mr-3 p-1 rounded-full"
                  >
                    <RxCross2 size={18} />
                  </span>
                </div>
                <div className="flex justify-center items-center h-full ">
                  <div className="bg-[#1f1f1f] p-5 rounded-2xl text-center   ">
                    <h1 className="text-lg">
                      Get Started by Configuring <br /> Your Brand’s AI
                    </h1>
                    <p className="text-[#cdcdcd] mt-2  text-sm">
                      Upload your PDFs and configure AI to <br /> track
                      performance.
                    </p>
                    <button
                      type="submit"
                      className={`w-full  py-2 rounded-xl mt-5 text-white 
                          bg-[#00AFFE] cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Configure AI
                    </button>
                  </div>
                </div>
                <div className="flex justify-center mx-5  rounded-xl bg-[#1d1d1d] gap-[10px] pr-2.5 items-center">
                  <input
                    className="flex-grow p-[10px] rounded-[10px] outline-none bg-[#1d1d1d] placeholder:text-[#fff]/20"
                    type="text"
                    disabled
                    placeholder="Ask me anything..."
                    style={{ width: "100%", color: "white" }}
                  />
                  <button
                    type="button"
                    className={`cursor-pointer  ${"bg-[#5A5A5A]"} p-1 rounded-xl`}
                  >
                    <IoMdArrowUp size={17} />
                  </button>
                </div>
                <p className="text-xs text-[#cdcdcd]/30 text-center  my-2">
                  Powered by SHOPPIE
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
