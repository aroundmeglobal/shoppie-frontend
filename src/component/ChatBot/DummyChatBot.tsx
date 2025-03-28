import Image from "next/image";
import { IoMdArrowUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { ThemeFields } from "../../../types";
import AskButton from "./askButton";
import { chatData } from "@/constants";

interface Props {
  brandName: string;
  logo: string;
  changedFields: ThemeFields;
  showBot: boolean;
  setShowBot: (showBot: boolean) => void;
}

export default function DummyChatBot({
  brandName,
  logo,
  changedFields,
  showBot,
  setShowBot,
}: Props) {
  if (!showBot) return;
  return (
    <div className=" h-[680px] mt-6 max-w-[450px] w-[450px] bg-[#161616]  bg-transparent rounded-3xl overflow-hidden">
      <div
        className={`pb-2 rounded-2xl flex flex-col flex-1 h-full w-full shadow-[0_2px_10px_rgba(0,0,0,0.5)] `}
        style={{ backgroundColor: changedFields.bgColor }}
      >
        <div
          className="flex justify-between md:justify-between items-center p-[10px]   rounded-tl-xl"
          style={{ backgroundColor: changedFields?.headerColor }}
        >
          <div className="text-[15px] font-bold flex items-center gap-[15px] p-1">
            <Image
              src={logo || "https://storage.aroundme.global/avatar_default.png"}
              alt="Chat"
              width={12}
              height={12}
              className="rounded-full w-12 h-12 object-cover cursor-pointer"
            />
            <div
              className=" text-lg max-w-[85%] line-clamp-1"
              style={{ color: changedFields?.textHeaderColor }}
            >
              {brandName}{" "}
            </div>
          </div>
          <span
            onClick={() => setShowBot(false)}
            role="img"
            aria-label="Back"
            className="cursor-pointer bg-[#5C5C5C]/50 mr-3 p-1 rounded-full"
          >
            <RxCross2 size={18} />
          </span>
        </div>

        <div
          className=" flex-col space-y-3 p-3 w-full flex overflow-y-auto  h-[520px] mb-4 "
          style={{ backgroundColor: changedFields?.bgColor }}
        >
          {chatData.map((item, index) => {
            if (item.type === "message") {
              return (
                <div
                  key={index}
                  className={`rounded-2xl  p-3 ${
                    item.fromAI
                      ? "max-w-[78%] mr-auto rounded-bl-none"
                      : "max-w-[78%] ml-auto rounded-br-none "
                  }`}
                  style={{
                    backgroundColor: item.fromAI
                      ? changedFields.assistantBgColor
                      : changedFields.userBgColor,
                  }}
                >
                  <h6
                    className="text-sm"
                    style={{
                      color: item.fromAI
                        ? changedFields.botTextColor
                        : changedFields.userTextColor,
                    }}
                  >
                    {item.text}
                  </h6>
                </div>
              );
            }
            if (item.type === "suggestion") {
              return (
                <div
                  key={index}
                  className={`rounded-3xl  p-3 
                       max-w-[78%] ml-auto border-[1px] 
                  `}
                  style={{
                    backgroundColor: `${changedFields?.userBgColor}90`,
                    borderColor: changedFields?.userBgColor,
                  }}
                >
                  <h6
                    className="text-sm"
                    style={{
                      color: item.fromAI
                        ? changedFields.botTextColor
                        : changedFields.userTextColor,
                    }}
                  >
                    {item.text}
                  </h6>
                </div>
              );
            }

            if (item.type === "product") {
              return (
                <div className="flex space-x-5">
                  {Array(2)
                    .fill(item)
                    .map((product, index) => (
                      <div
                        key={`${product.id}-${index}`}
                        className="h-[262px] w-[196px] flex flex-col  rounded-xl overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: changedFields?.cardBgColor }}
                      >
                        <div className="h-[180px] bg-[#2d2d2d] justify-center flex items-center">
                          <h6 className="text-sm">Product image</h6>
                        </div>
                        <div className="flex flex-col p-3 ">
                          <span
                            className="text-sm"
                            style={{ color: changedFields?.cardTextColor }}
                          >
                            {index === 0
                              ? product.name
                              : "Creatine Monohydrate Powder"}
                          </span>
                          <div className="flex w-full justify-between items-center mt-2">
                            <div className="flex flex-col ">
                              <span
                                className="text-lg"
                                style={{
                                  color: changedFields?.cardTextSubColour,
                                }}
                              >
                                {index === 0 ? product.price : "₹1499"}
                              </span>
                              <span
                                className="text-sm"
                                style={{
                                  textDecoration: "line-through",
                                  color: changedFields?.cardTextSubColour,
                                }}
                              >
                                {index === 0 ? product.original : "₹1999"}
                              </span>
                            </div>
                            <AskButton
                              onClick={() => {}}
                              width={8}
                              height={8}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              );
            }

            return null;
          })}
        </div>

        <div
          className="flex   justify-center mx-3  rounded-xl  gap-[10px] pr-2.5 items-center"
          style={{ backgroundColor: changedFields?.inputbarColor }}
        >
          <input
            className="flex-grow p-[10px] rounded-[10px] outline-none"
            type="text"
            disabled
            placeholder="Ask me anything..."
            value={"Ask me anything..."}
            style={{
              width: "100%",
              color: changedFields?.InputTextColor || "#fff/20",
              backgroundColor: changedFields?.inputbarColor,
            }}
          />
          <button
            type="button"
            className={`cursor-pointer  ${"bg-[#5A5A5A]"} p-1 rounded-xl`}
          >
            <IoMdArrowUp size={17} />
          </button>
        </div>
        <p className="text-sm text-[#cdcdcd]/30 text-center  mt-2">
          Powered by SHOPPIE
        </p>
      </div>
    </div>
  );
}
