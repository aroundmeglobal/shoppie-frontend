import React, { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import toast from "react-hot-toast";

const Code = ({ codes }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleHeadingClick = (index) => {
    setActiveIndex(index);
  };

  const handleCopyClick = () => {
    const codeToCopy = codes[activeIndex].copyContent;
    navigator.clipboard
      .writeText(codeToCopy)
      .then(() => toast.success("Code copied to clipboard!"))
      .catch((error) => {
        console.error("Failed to copy code: ", error);
        toast.error("Failed to copy code!");
      });
  };
  

  return (
    <div className="mt-6 mb-8  h-[85%]">
      {/* Title & Copy Button */}
      <div className="flex justify-between border-[1px] border-[#4d4d4d] rounded-t-xl p-2">
        <div className="flex">
          {codes.map((code, index) => (
            <div
              key={index}
              className={`px-5 py-2 cursor-pointer text-sm font-medium ${
                activeIndex === index ? "text-blue-400" : "text-gray-300"
              } hover:bg-blue-900 rounded-t-lg`}
              onClick={() => handleHeadingClick(index)}
            >
              <h4>{code.heading}</h4>
            </div>
          ))}
        </div>

        <button
          onClick={handleCopyClick}
          className="flex items-center p-2 border border-transparent rounded-lg hover:shadow-lg transition duration-300 hover:border-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 96 960 960"
            width="20"
            className="fill-gray-300"
          >
            <path d="M180 975q-24 0-42-18t-18-42V312h60v603h474v60H180Zm120-120q-24 0-42-18t-18-42V235q0-24 18-42t42-18h440q24 0 42 18t18 42v560q0 24-18 42t-42 18H300Zm0-60h440V235H300v560Zm0 0V235v560Z"></path>
          </svg>
        </button>
      </div>

      {/* Code Container */}
      <div className="border-[1px] border-[#4d4d4d] max-h-[95%] h-[95%] bg-[#0d0d0d] overflow-y-auto rounded-b-xl">
        {codes.map((code, index) => (
          <div
            key={index}
            className={` ${activeIndex === index ? "block" : "hidden"}`}
          >
            <pre className="prism-code language-jsx">
              <code
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(code.content),
                }}
              ></code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Code;
