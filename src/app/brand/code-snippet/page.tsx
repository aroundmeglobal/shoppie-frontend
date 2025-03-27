"use client";

import React, { useEffect, useState } from "react";
import Prism from "prismjs"; // Import Prism.js
import "prismjs/components/prism-jsx";
import "../../prism-theme.css";
import useBrandStore from "@/store/useBrandStore";
import Code from "@/component/Code";
import { useRouter } from "next/navigation";
import Spinner from "@/component/Spinner";
import { GiAutoRepair } from "react-icons/gi";

const hilight = (code: any, language = "markup") => {
  return Prism.highlight(code, Prism.languages[language], language);
};

const Page = () => {
  const brandId = useBrandStore((state) => state.brandId);
  const workspaceExist = useBrandStore((state) => state.workspaceExists);
  const embed_id = useBrandStore((state) => state.embedId);
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const pageIndex = `
<!--
Paste this script at the bottom of your HTML before the </body> tag.
See more style and config options on our docs
https://github.com/Mintplex-Labs/anything-llm/tree/master/embed/README.md 
-->

<script
    data-embed-id="${embed_id || brandId}"
    data-base-api-url="https://anythingllm.aroundme.global/api/embed"
    src="https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js">
  </script>

<!-- AnythingLLM (https://anythingllm.com) -->

`;

  const paCode = hilight(pageIndex);

  const pageCodeSnippets = [
    { heading: "Script code", content: paCode, copyContent: pageIndex },
  ];

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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Main content container */}
      <div className="ml-20 px-5 overflow-y-auto h-screen ">
        <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
          Code snippets
        </h1>
        <div className="w-full h-[85%] gap-5 mt-8 flex  justify-center  no-scrollbar">
          <div className="w-[60%] h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar">
            <h2 className="text-white text-2xl font-semibold mb-4 ">
              Copy and Paste
            </h2>
            <h2 className="text-white text-md  mb-4">
              Simply copy the script below and paste it into your main code at
              the specified location. Watch the magic unfold effortlessly! ✨
            </h2>

            <Code codes={pageCodeSnippets} />
          </div>

          <div className="w-[40%] h-[40%] bg-[#161616] rounded-xl overflow-hidden flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/rteD2vHPjaM"
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>
      {workspaceExist && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50">
          <div className="bg-[#1d1d1d] rounded-xl shadow-lg p-6 w-96">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#2d2d2d] rounded-full">
                <GiAutoRepair size={30} />
              </div>
              <h2 className="text-lg font-semibold mt-4">
                Configure Your Brand's AI
              </h2>
            </div>
            <button
              type="submit"
              onClick={() => router.replace("/brand/configure")}
              className={`w-full  py-2 rounded-xl mt-5 text-white 
                          bg-[#00AFFE] cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Configure AI
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
