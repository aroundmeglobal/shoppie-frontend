"use client";

import React, { useEffect, useState } from "react";
import Prism from "prismjs"; // Import Prism.js
import "prismjs/components/prism-jsx";
import "../../prism-theme.css";
import useBrandStore from "@/store/useBrandStore";
import Code from "@/component/Code";

export const pageIndex = `
<!--
Paste this script at the bottom of your HTML before the </body> tag.
See more style and config options on our docs
https://github.com/Mintplex-Labs/anything-llm/tree/master/embed/README.md 
-->

<script
  data-embed-id="b5909a44-7e5b-494b-a9e4-3b29c35e1da2"
  data-base-api-url="https://anythingllm.aroundme.global/api/embed"
  src="https://anythingllm.aroundme.global/embed/anythingllm-chat-widget.min.js">
</script>

<!-- AnythingLLM (https://anythingllm.com) -->

`;

const hilight = (code: any, language = "markup") => {
  return Prism.highlight(code, Prism.languages[language], language);
};

const Page = () => {
  const brandId = useBrandStore((state) => state.brandId);
  const workspaceExist = useBrandStore((state) => state.workspaceExists);
  const paCode = hilight(pageIndex);

  const pageCodeSnippets = [
    { heading: "Script code", content: paCode, copyContent: pageIndex },
  ];

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
    </div>
  );
};

export default Page;
