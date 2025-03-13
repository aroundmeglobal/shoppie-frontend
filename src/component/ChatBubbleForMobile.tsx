"use client";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import Product from "./ChatBot/Product";
import { useCallback, useState } from "react";
import Link from "next/link";
import fixDataFormat from "@/lib/fixDataFormat";

type Message = {
  sender: string;
  text: string;
  suggestions?: string;
};

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 mt-2 z-0">
      {/* Dot 1 */}
      <div className="w-2 h-2 rounded-full bg-[#9d9d9d] animate-blink-up-down [animation-delay:0s]" />
      {/* Dot 2 */}
      <div className="w-2 h-2 rounded-full bg-[#9d9d9d] animate-blink-up-down [animation-delay:0.3s]" />
      {/* Dot 3 */}
      <div className="w-2 h-2 rounded-full bg-[#9d9d9d] animate-blink-up-down [animation-delay:0.6s]" />
    </div>
  );
};

export const ChatBubbleForMobile = ({
  message,
  brand_id,
  isTyping,
  handleSend,
  isLastBotMessage,
  setProductForAsk,
}: {
  brand_id: string;
  message: Message;
  isTyping: boolean;
  isLastBotMessage: boolean;
  handleSend: (text: string) => void;
  setProductForAsk: (product: any) => void;
}) => {
  const cleanMessageText = (text: string) => {
    if (text.startsWith('"') && text.endsWith('"')) {
      return text.slice(1, -1); // Remove leading and trailing quotes
    }
    return text;
  };

  const [textBefore, restOfText] = cleanMessageText(message.text)?.split(
    "@@SUGGESTIONS START@@"
  ) ?? ["", ""];

  const [suggestionText, textAfter] = restOfText
    ? restOfText.split("@@SUGGESTIONS END@@")
    : ["", restOfText];

  const [textBeforeSuggestionQueries, restOfTextQueries] = cleanMessageText(
    message.text
  )?.split("@@PROMPTS START@@") ?? ["", ""];

  const [suggestionQueries, textAfterQueries] = restOfTextQueries
    ? restOfTextQueries.split("@@PROMPTS END@@")
    : ["", restOfTextQueries];

  const [beforeReplyProduct, restOfReplyProduct] = cleanMessageText(
    message.text
  )?.split("->REPLY START->") ?? ["", ""];

  const [replyProduct, textAfterReplyProduct] = restOfReplyProduct
    ? restOfReplyProduct.split("->REPLY END->")
    : ["", restOfReplyProduct];

  const handleSelectedSuggestion = (text: string) => {
    handleSend(text);
  };

  if (!message) return null;
  return (
    <div
      className={`mb-[10px] flex ${
        message.sender === "You" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`text-white overflow-hidden`}>
        {message.text && !textBefore.includes("->REPLY START->") && (
          <div
            className={`${
              message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
            } max-w-[400px] rounded-[8px] px-[8px] pt-2 pb-[0.1px]  `}
          >
            <ReactMarkdown
              children={textBefore}
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    className="text-2xl font-bold mt-4 mb-2 text-white"
                    {...props}
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl font-semibold mt-3 mb-1 text-white/70"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-lg font-semibold mt-2 mb-1 text-white/"
                    {...props}
                  />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-sm mb-2 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5 mb-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-sm mb-1" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold" {...props} />
                ),
                em: ({ node, ...props }) => (
                  <em className="italic" {...props} />
                ),
              }}
            />
          </div>
        )}

        <div className="overflow-hidden mt-4 ">
          {suggestionText ? (
            <div className="flex overflow-x-auto gap-4 pb-4">
              {(() => {
                try {
                  const suggestionData = JSON.parse(suggestionText);

                  if (
                    suggestionData.products &&
                    Array.isArray(suggestionData.products)
                  ) {
                    return (
                      <>
                        {suggestionData.products.map(
                          (product: any, index: number) => (
                            <Product
                              key={index}
                              product={product}
                              fromChatBubble={true}
                              setProductForAsk={setProductForAsk}
                            />
                          )
                        )}
                      </>
                    );
                  }
                } catch (error) {
                  console.error("Error parsing suggestions JSON:", error);
                }
                return null;
              })()}
            </div>
          ) : message.suggestions ? (
            <div className="flex overflow-x-auto gap-4 pb-4">
              {(() => {
                try {
                  const suggestionData = JSON.parse(message.suggestions);
                  if (
                    suggestionData.products &&
                    Array.isArray(suggestionData.products)
                  ) {
                    return suggestionData.products.map(
                      (product: any, index: number) => (
                        <Product
                          key={index}
                          product={product}
                          fromChatBubble={true}
                          setProductForAsk={setProductForAsk}
                        />
                      )
                    );
                  }
                } catch (error) {
                  console.error("Error parsing suggestions JSON:", error);
                }
                return null;
              })()}
            </div>
          ) : null}
        </div>
        {replyProduct ? (
          <div className="flex overflow-x-auto gap-4 pb-4 justify-end">
            {(() => {
              try {
                const RepliedProduct = fixDataFormat(replyProduct);

                if (RepliedProduct) {
                  return (
                    <Product
                      product={RepliedProduct}
                      setProductForAsk={setProductForAsk}
                      fromChatBubble={true}
                    />
                  );
                }
              } catch (error) {
                console.error("Error parsing suggestions JSON:", error);
              }
              return null;
            })()}
          </div>
        ) : null}
        {textAfterReplyProduct && (
          <div className="flex items-end justify-end">
            <div
              className={`${
                message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
              } max-w-[400px] w-auto rounded-[8px] px-[8px] pt-2 pb-[0.1px]  `}
            >
              <div>
                <ReactMarkdown
                  children={textAfterReplyProduct}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1
                        className="text-2xl font-bold mt-4 mb-2 text-white"
                        {...props}
                      />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-semibold mt-3 mb-1 text-white/70"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-semibold mt-2 mb-1 text-white/"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-sm mb-2 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-5 mb-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-sm mb-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* {textAfter && (
          <div
            className={`${
              message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
            } max-w-[400px] rounded-[8px] p-[8px] `}
          >
            <div>
              <ReactMarkdown
                children={textAfter}
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold mt-4 mb-2 text-white"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-semibold mt-3 mb-1 text-white/70"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-semibold mt-2 mb-1 text-white/"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="text-sm mb-2 leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-sm mb-1" {...props} />
                  ),
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                  ),
                  em: ({ node, ...props }) => (
                    <em className="italic" {...props} />
                  ),
                }}
              />
            </div>
          </div>
        )} */}
        {suggestionQueries && isLastBotMessage ? (
          <div className="flex justify-end mt-4  ">
            <div className="flex flex-col items-end gap-4   ">
              {(() => {
                try {
                  let suggestionData = JSON.parse(suggestionQueries);

                  return (
                    <>
                      {suggestionData
                        .slice(0, 3)
                        .map((suggestion: any, index: number) => {
                          return (
                            <button
                              key={index}
                              onClick={() =>
                                handleSelectedSuggestion(suggestion)
                              }
                            >
                              <div className="flex-shrink-0 w-auto px-3 text-[13px] p-2 rounded-full flex text-start items-start bg-[#1E60FB] text-white cursor-pointer">
                                <h5>{suggestion}</h5>
                              </div>
                            </button>
                          );
                        })}
                    </>
                  );
                } catch (error) {
                  console.error("Error parsing suggestions JSON:", error);
                }
                return null;
              })()}
            </div>
          </div>
        ) : null}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};
