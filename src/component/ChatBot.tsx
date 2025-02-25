"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface Brand {
  name: string;
  imageUrl: string;
}

interface ChatPageProps {
  selectedBrand: Brand;
}

type Message = {
  sender: string;
  text: string;
  suggestions?: string;
};

const LLM_BASE_URL = "https://anythingllm.aroundme.global/api/";
const LLM_AUTH_TOKEN = "J4GCTGM-C0RMBYZ-HSZXQTD-1GXP4AF";

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
const ChatBubble = ({
  message,
  isTyping,
}: {
  message: Message;
  isTyping: boolean;
}) => {
  const [textBefore, textAfter] = message.text?.split("@@START") ?? ["", ""];

  return (
    <div
      className={`mb-[10px] flex ${
        message.sender === "You" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`${
          message.sender === "You" ? "bg-[#1E60FB]" : "trnasparent"
        } text-white p-[8px] rounded-[8px]  break-words whitespace-pre-wrap overflow-hidden`}
      >
        <div
          className={`${
            message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
          } max-w-[400px]`}
        >
          <p>{textBefore}</p>
        </div>

        {/* -- Suggestions Rendering -- */}
        <div className="overflow-hidden mt-4 ">
          {message.suggestions && (
            <div className="flex overflow-x-auto gap-4 pb-4">
              {(() => {
                try {
                  const suggestionData = JSON.parse(message.suggestions);
                  if (
                    suggestionData.products &&
                    Array.isArray(suggestionData.products)
                  ) {
                    return suggestionData.products.map((product: any) => (
                      <div
                        key={product.id}
                        className="product-card flex-shrink-0 flex flex-col items-center w-[300px] bg-gborder p-4 rounded-xl bg-[#2d2d2d] text-yellow-50 h-[320px] gap-5"
                      >
                        <Image
                          src={product.image_url}
                          alt={product.title}
                          width={100}
                          height={48}
                          className="w-full h-48 object-cover rounded-xl"
                        />
                        <div className="ml-4 flex flex-col justify-between flex-grow">
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
                    ));
                  }
                } catch (error) {
                  console.error("Error parsing suggestions JSON:", error);
                }
                return null;
              })()}
            </div>
          )}
        </div>

        <div
          className={`${
            message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
          } max-w-[400px]`}
        >
          <div>
            <p>{textAfter}</p>
          </div>
        </div>

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};

export default function ChatPage({ selectedBrand }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fetchingMessage, setFetchingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const transformMessages = (data: Array<any>) => {
    return data.map((msg) => ({
      id: uuidv4(),
      message: msg.content, // Use `msg.content` for the message
      sender: msg.role === "user" ? "You" : "Bunny", // Sender logic
      user_id: msg.role === "user" ? 1 : 2,
      text: msg.content, // Ensure `text` is included here
    }));
  };

  useEffect(() => {
    setFetchingMessage(true);
    const fetchMessages = async () => {
      try {
        const chatData = await fetch(`${LLM_BASE_URL}/v1/workspace/369/chats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${LLM_AUTH_TOKEN}`,
          },
        });

        const messageData = await chatData.json();

        const history = messageData?.history;
        if (Array.isArray(history)) {
          const transformedMessages = transformMessages(history);
          console.log("trnasformed", transformedMessages);

          setMessages(transformedMessages);
        } else {
          console.error("No valid history found in messageData", messageData);
        }
        setFetchingMessage(false);
      } catch (error) {
        setFetchingMessage(false);
        console.error("Error fetching messages:", error);
      }

      console.log(messages);
    };

    fetchMessages();
  }, []);

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
    setIsTyping(true);
    setMessages((prev) => [...prev, { sender: "Bunny", text: "" }]);

    try {
      const response = await fetch(
        `${LLM_BASE_URL}v1/workspace/369/stream-chat`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LLM_AUTH_TOKEN}`,
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
            setIsTyping(false);
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
      setIsTyping(false);
    } catch (error: any) {
      console.error("Error fetching from API:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "Bunny", text: "Error occurred while fetching response." },
      ]);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex flex-col top-0 fixed w-full h-full bg-[#09090b] md:w-[550px] md:h-[75%] md:rounded-[10px] md:bottom-[0px] md:right-[50px] md:top-[20%] shadow-md overflow-hidden z-30">
        <div className="flex justify-between md:justify-between items-center p-[10px]">
          <div className="text-[15px] font-bold flex items-center gap-[15px] text-white">
            <span role="img" aria-label="Back" onClick={handleBack}>
              <Image
                src={"/img/white-back-arrow.svg"}
                alt="Back"
                width={20}
                height={20}
                style={{ width: "20px", height: "20px", marginLeft: "10px" }}
              />
            </span>
            <Image
              src={selectedBrand.imageUrl}
              alt="Chat"
              width={20}
              height={20}
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        </div>

        {/* <div
          className="flex-grow overflow-y-auto p-[15px] font-sans text-[15px] text-black no-scrollbar "
          style={{ height: "calc(100% - 150px)" }}
        >
          {fetchingMessage && (
            // typing
            <div className="flex items-center p-2.5">
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
            </div>
          )}
          {messages.map(renderMessage)}

          {isTyping && (
            <div className="flex items-center p-2.5">
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
              <span className="inline-block w-2 h-2 mx-0.5 bg-gray-300 rounded-full animate-typing"></span>
            </div>
          )}
        </div> */}
        <div className="flex-grow overflow-y-auto p-[10px] bg-[#161616]">
          {messages.map((msg, index) => {
            // If this is the *last* bot message, we conditionally pass isTyping
            const isLastBotMessage =
              index === messages.length - 1 && msg.sender === "Bunny";
            return (
              <ChatBubble
                key={index}
                message={msg}
                isTyping={isLastBotMessage && isTyping}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* <SwipeableViews className="no-scrollbar">
          <div className="flex flex-row overflow-y-auto p-[10px] gap-[5px] bg-transparent rounded-[10px] cursor-pointer scroll-smooth mt-[10px] mb-[5px] no-scrollbar">
            {quickQuestions.map((question, index) => (
              <div
                className="p-[9px] rounded-[10px] text-white bg-[#4f46e5] transition-transform duration-300 min-w-[200px] flex-shrink-0 hover:bg-[#4f46e5] overflow-y-scroll scrollbar-hide"
                key={index}
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </div>
            ))}
          </div>
        </SwipeableViews> */}
        <div className="flex p-[10px] bg-[#09090b] border-t-[0.1px]-[#1d1d1d] gap-[10px]">
          <input
            className="flex-grow p-[10px] rounded-[10px] outline-none bg-[#1d1d1d]"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            style={{ width: "100%", height: "40px", color: "white" }}
          />
          <Image
            src="/img/send_button.svg"
            alt="Send"
            width={50}
            height={20}
            onClick={handleSend}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
