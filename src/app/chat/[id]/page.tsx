"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ChatBubble } from "@/component/ChatBubble";
import { getWorkspaceHistory } from "@/api/getWorkspaceHistory";
import useBrandStore from "@/store/selectedBrand";
import useUuid from "@/hooks/useLocalStorage";
import VoiceInputbar from "@/component/VoiceInputbar";
import { BeatLoader, ClipLoader } from "react-spinners";

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
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [tempVoiceId, setTempVoiceId] = useState<string | null>(null);
  const brand = useBrandStore((state) => state.brand);
  const sessionId = useUuid();

  const { data, error, isLoading } = useQuery({
    queryKey: ["workspaceHistory", params.id],
    queryFn: async () => {
      const messageData = await getWorkspaceHistory({
        embed_id: brand.workspaces[0].embed_id,
        sessionId: sessionId || "",
      });
      const history = messageData?.history;

      if (Array.isArray(history) && history.length) {
        return [
          {
            id: uuidv4(),
            message: `Hey buddy! I am an AI shopping assistant from ${brand?.brand_name}, let me know how I can help you!`,
            sender: "Bunny",
            user_id: 2,
            text: `Hey buddy! I am an AI shopping assistant from ${brand?.brand_name}, let me know how I can help you!`,
          },
          ...history.map((msg: any) => ({
            id: uuidv4(),
            message: msg.content,
            sender: msg.role === "user" ? "You" : "Bunny",
            user_id: msg.role === "user" ? 1 : 2,
            text: msg.content,
          })),
        ];
      } else {
        return [
          {
            id: uuidv4(),
            message: `Hey buddy! I am an AI shopping assistant from ${brand?.brand_name}, let me know how I can help you!`,
            sender: "Bunny",
            user_id: 2,
            text: `Hey buddy! I am an AI shopping assistant from ${brand?.brand_name}, let me know how I can help you!`,
          },
        ];
      }
    },
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    } else if (error) {
      // Handle error if needed
    }
  }, [data, error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBack = () => {
    router.push("/");
  };

  const handleSend = async (message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (!messageToSend) return;

    setMessages((prev) => {
      if (tempVoiceId) {
        return prev.map((msg) =>
          msg.id === tempVoiceId ? { ...msg, text: messageToSend } : msg
        );
      }
      return [...prev, { id: uuidv4(), sender: "You", text: messageToSend }];
    });

    setTempVoiceId(null);
    setInputValue("");
    setIsTyping(true);
    setMessages((prev) => [
      ...prev,
      { id: uuidv4(), sender: "Bunny", text: "" },
    ]);

    try {
      const response = await fetch(
        `https://anythingllm.aroundme.global/api/embed/${brand?.workspaces[0]?.embed_id}/stream-chat`,
        {
          method: "POST",
          body: JSON.stringify({
            message: JSON.stringify(messageToSend),
            sessionId: sessionId,
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

  const renderMessage = (msg: any, index: number) => (
    <ChatBubble
      key={msg.id || index}
      message={msg}
      isTyping={false}
      handleProductClick={() => {}}
    />
  );

  const handleBrandIconClick = () => {
    router.push(`/chat/details/${params.id}`);
  };

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
              width={12}
              height={12}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div onClick={handleBrandIconClick} className="text-white text-lg">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <ClipLoader color="#9d9d9d" />
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
        <VoiceInputbar
          setMessages={setMessages}
          onSend={handleSend}
          setIsRecording={setIsVoiceRecording}
          setTempVoiceId={setTempVoiceId}
          tempVoiceId={tempVoiceId}
          setInputValue={setInputValue}
          inputValue={inputValue}
        />
      </div>
    </div>
  );
}
