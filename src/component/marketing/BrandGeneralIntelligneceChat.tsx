"use client";

import React, { useState, useEffect, useRef } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import useBrandStore from "@/store/useBrandStore";
import Image from "next/image";
const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 mt-2">
      {/* Dot 1 */}
      <div className="w-2 h-2 rounded-full bg-[#9d9d9d] animate-blink-up-down [animation-delay:0s]" />
      {/* Dot 2 */}
      <div className="w-2 h-2 rounded-full bg-[#9d9d9d] animate-blink-up-down [animation-delay:0.3s]" />
      {/* Dot 3 */}
      <div className="w-2 h-2 rounded-full bg-[#9d9d9d] animate-blink-up-down [animation-delay:0.6s]" />
    </div>
  );
};
// import your typing indicator

type Message = {
  sender: string;
  text: string;
  suggestions?: string;
};

const ChatBubble = ({
  message,
  isTyping,
}: {
  message: Message;
  isTyping: boolean;
}) => {
  const [textBefore, textAfter] = message.text.split("@@START") ?? ["", ""];

  return (
    <div
      className={`mb-[10px] flex ${
        message.sender === "You" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`${
          message.sender === "You" ? "bg-[#1E60FB]" : "trnasparent"
        } text-white p-[8px] rounded-[8px] max-w-[80%] break-words whitespace-pre-wrap`}
      >
        <div
          className={`${
            message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
          }`}
        >
          <p>{textBefore}</p>
        </div>

        {/* -- Suggestions Rendering -- */}
        {message.suggestions && (
          <div className="mt-4">
            {(() => {
              try {
                const suggestionData = JSON.parse(message.suggestions);
                if (
                  suggestionData.products &&
                  Array.isArray(suggestionData.products)
                ) {
                  return (
                    <div className="flex overflow-x-auto gap-4">
                      {suggestionData.products.map((product: any) => (
                        <div
                          key={product.id}
                          className="product-card flex-shrink-0 flex flex-col items-center w-[300px] bg-gborder p-4 rounded-xl bg-[#2d2d2d] text-yellow-50 h-[320px] gap-5 "
                        >
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            width={100}
                            height={48}
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <div className="ml-4  flex flex-col justify-between flex-grow ">
                            <h3 className="font-semibold line-clamp-2">
                              {product.title}
                            </h3>
                            <p className="text-sm mt-3">
                              <span className="line-through text-[grey]/90 mr-2">
                                {product.original_price}
                              </span>
                              <span className="text-green-400">
                                {product.discounted_price}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }
              } catch (error) {
                console.error("Error parsing suggestions JSON:", error);
              }
              return null;
            })()}
          </div>
        )}

        <div
          className={`${
            message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
          }`}
        >
          <div>
            <p>{textAfter}</p>
          </div>
        </div>

        {/* -- If it's the bot's last message and it is still typing, show indicator -- */}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};

const BrandGeneralIntelligneceChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // State to track if the bot is currently "typing"
  const [isBotTyping, setIsBotTyping] = useState(false);

  const userId = useBrandStore((state) => state.userId);
  const logo = useBrandStore((state) => state.logo);
  const brandName = useBrandStore((state) => state.brandName);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: inputValue.trim() },
    ]);
    const messageToSend = inputValue.trim();
    setInputValue("");

    // Immediately add a blank bot message to the array
    // and set isBotTyping to true
    setIsBotTyping(true);
    setMessages((prev) => [...prev, { sender: "Bunny", text: "" }]);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}v1/workspace/${userId}/stream-chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            message: JSON.stringify(messageToSend),
            attachments: [],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let isCapturingSuggestions = false;
      let suggestionBuffer = "";
      let botFullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (trimmedLine === "data: [DONE]") {
            // Mark the end of streaming
            setIsBotTyping(false);
            break;
          }

          if (trimmedLine.startsWith("data:")) {
            try {
              const jsonData = JSON.parse(trimmedLine.substring(5));
              const responseText = jsonData.textResponse || "";

              // Start capturing suggestions
              if (responseText === "@@" && !isCapturingSuggestions) {
                isCapturingSuggestions = true;
                suggestionBuffer = "";
                botFullResponse += "@@START";
              }

              if (isCapturingSuggestions) {
                suggestionBuffer += responseText;
                if (suggestionBuffer.includes("@@SUGGESTIONS END@@")) {
                  isCapturingSuggestions = false;
                  const cleanSuggestionText = suggestionBuffer
                    .replace(/@@SUGGESTIONS START@@/g, "")
                    .replace(/@@SUGGESTIONS END@@/g, "")
                    .trim();

                  // Update the last bot message with suggestions
                  setMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    if (
                      updatedMessages.length > 0 &&
                      updatedMessages[updatedMessages.length - 1].sender ===
                        "Bunny"
                    ) {
                      updatedMessages[updatedMessages.length - 1].suggestions =
                        cleanSuggestionText;
                    }
                    return updatedMessages;
                  });
                }
              } else {
                botFullResponse += responseText;
                setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages];
                  if (
                    updatedMessages.length > 0 &&
                    updatedMessages[updatedMessages.length - 1].sender ===
                      "Bunny"
                  ) {
                    updatedMessages[updatedMessages.length - 1].text =
                      botFullResponse;
                  }
                  return updatedMessages;
                });
              }
            } catch (jsonError) {
              console.error(
                "Error parsing JSON:",
                jsonError,
                "Line:",
                trimmedLine
              );
            }
          }
        }
      }

      // Once the while loop finishes (stream ends), set isBotTyping to false
      setIsBotTyping(false);
    } catch (error: any) {
      console.error("Error fetching from API:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "Bunny", text: "Error occurred while fetching response." },
      ]);
      setIsBotTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-[10px] bg-[#1C1C1C] border-b-[1px] text-white font-bold flex items-center">
        <Image
          src={logo || "https://storage.aroundme.global/avatar_default.png"}
          alt="Logo"
          width={30}
          height={30}
          className="rounded-[5px]"
        />
        <span className="mx-[10px] text-xl">{brandName}</span>
        <span>(for testing and iterations)</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-[10px] bg-[#161616]">
        {messages.map((msg, index) => {
          // If this is the *last* bot message, we conditionally pass isTyping
          const isLastBotMessage =
            index === messages.length - 1 && msg.sender === "Bunny";
          return (
            <ChatBubble
              key={index}
              message={msg}
              isTyping={isLastBotMessage && isBotTyping}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-[10px] border-t border-[#333] bg-[#1C1C1C] flex">
        <input
          type="text"
          placeholder="Message GPT"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow h-[40px] px-3 border-none outline-none text-sm bg-[#282828]/70 rounded-2xl placeholder:text-[#A4A4A4]"
        />
        <button
          onClick={handleSend}
          className="ml-[10px] p-[8px] rounded-full bg-[#1E60FB] text-white"
        >
          <RiSendPlaneFill size={20} className="rotate-15" />
        </button>
      </div>
    </div>
  );
};

export default BrandGeneralIntelligneceChat;
