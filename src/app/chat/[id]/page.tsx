"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ChatBubble } from "@/component/ChatBubble";
import { getWorkspaceHistory } from "@/api/getWorkspaceHistory";
import useBrandStore from "@/store/selectedBrand";
import { IoMdArrowUp } from "react-icons/io";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: PageProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const brand = useBrandStore((state) => state.brand);


  // Fetch initial chat history via React Query.
  const { data, error, isLoading } = useQuery({
    queryKey: ["workspaceHistory", params.id],
    queryFn: async () => {
      const messageData = await getWorkspaceHistory(params.id);
      const history = messageData?.history;
      if (Array.isArray(history)) {
        return history.map((msg: any) => ({
          id: uuidv4(),
          message: msg.content, // message content
          sender: msg.role === "user" ? "You" : "Bunny", // determine sender
          user_id: msg.role === "user" ? 1 : 2,
          text: msg.content,
        }));
      }
      throw new Error("No valid history found");
    },
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBack = () => {
    router.push("/");
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const messageToSend = inputValue.trim();
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "You", text: messageToSend },
    ]);
    setInputValue("");

    // Immediately add a blank bot message and start typing.
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "Bunny", text: "" },
    ]);

    try {

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LLM_BASE_URL}/workspace/${params.id}/stream-chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwIjoiMjY2ODFlYTlhOGVjNzcyYmI1MjRiZDg2ZjFhNzQ5ZGU6ZmNkMDUxOWZhY2I5YzEyNjI2MzJhYTVlNzM3YmJiYzIiLCJpYXQiOjE3NDA2MzkxMzcsImV4cCI6MTc0MzIzMTEzN30.RbZkvpoxhKBFQBBnnTNML66tG3s3LWHBXUiRLLAfzpM
      
            `,
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
            // End streaming.
            setIsTyping(false);
            break;
          }

          if (trimmedLine.startsWith("data:")) {
            try {
              const jsonData = JSON.parse(trimmedLine.substring(5));
              const responseText = jsonData.textResponse || "";

              // Start capturing suggestions.
              if (responseText === "@@" && !isCapturingSuggestions) {
                isCapturingSuggestions = true;
                suggestionBuffer = "";
                botFullResponse += "@@SUGGESTIONS START@@";
              }

              if (isCapturingSuggestions) {
                suggestionBuffer += responseText;
                if (suggestionBuffer.includes("@@SUGGESTIONS END@@")) {
                  isCapturingSuggestions = false;
                  botFullResponse += "@@SUGGESTIONS END@@";
                  const cleanSuggestionText = suggestionBuffer
                    .replace(/@@SUGGESTIONS START@@/g, "")
                    .replace(/@@SUGGESTIONS END@@/g, "")
                    .trim();

                  // Update last bot message with suggestions.
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

      setIsTyping(false);
    } catch (error: any) {
      console.error("Error fetching from API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          sender: "Bunny",
          text: "Error occurred while fetching response.",
        },
      ]);
      setIsTyping(false);
    }
  };

  // Handle Enter key press.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  // Render each message using your ChatBubble component.
  const renderMessage = (msg: any, index: number) => (
    <ChatBubble
      key={msg.id || index}
      message={msg}
      isTyping={false}
      handleProductClick={() => {}}
    />
  );

  const handleBrandIconClick =()=>{
    router.push(`/chat/details/${params.id}`)
  }

  return (
    <div>
      <div className="flex flex-col top-0 fixed w-full h-full bg-[#09090b] md:w-[400px] md:h-[75%] md:rounded-[10px] md:bottom-[90px] md:right-[20px] md:top-[10%] shadow-md overflow-hidden z-30 ">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-[10px] border-b-[1px]">
          <div className="text-[15px] font-bold flex items-center gap-[15px] text-white p-1">
            <span role="img" aria-label="Back" onClick={handleBack}>
              <Image
                src={"/img/white-back-arrow.svg"}
                alt="Back"
                width={16}
                height={16}
                style={{
                  width: "16px",
                  height: "16px",
                  marginLeft: "10px",
                }}
              />
            </span>
            <Image
                onClick={handleBrandIconClick}
              src={
                brand.brand_logo ||
                "https://storage.aroundme.global/avatar_default.png"
              }
              alt="Chat"
              width={40}
              height={40}
              style={{ width: "40px", height: "40px", borderRadius: "50px" }}
            />
            <div
              onClick={handleBrandIconClick}
              className="text-white text-lg"
            >
              {brand.brand_name}
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div
          className="flex-grow overflow-y-auto p-[15px] font-sans text-[15px] text-black no-scrollbar"
          style={{ height: "calc(100% - 150px)" }}
        >
          {isLoading && (
            <div className="flex items-center p-2.5">
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
            </div>
          )}
          {error && <div className="p-2 text-red-500">{error.message}</div>}
          {messages && messages.map(renderMessage)}
          {isTyping && (
            <ChatBubble
              message={{
                id: uuidv4(),
                message: "Bunny is typing...",
                sender: "Bunny",
                user_id: 2,
                text: "",
              }}
              isTyping={true}
              handleProductClick={() => {}}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar fixed at the bottom */}
        <div className="flex bg-[#1d1d1d] border-t gap-[10px] m-2 rounded-[12px]">
          <input
            autoFocus
            className="flex-grow p-[10px] rounded-[10px] outline-none bg-[#1d1d1d] placeholder:text-[#fff]/20"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            // style={{ width: "100%", color: "white" }}
          />
          <button
            className={`cursor-pointer m-2 p-1 rounded-full ${
              inputValue.trim() ? "bg-blue-500" : "bg-[#5A5A5A]"
            }`}
          >
            <IoMdArrowUp size={18} onClick={handleSend} />
          </button>
        </div>
      </div>
    </div>
  );
}
