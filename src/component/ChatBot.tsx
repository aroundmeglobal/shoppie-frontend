"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const LLM_BASE_URL = "https://anythingllm.aroundme.global/api/";
const LLM_AUTH_TOKEN = "J4GCTGM-C0RMBYZ-HSZXQTD-1GXP4AF";

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
  handleProductClick,
}: {
  message: Message;
  isTyping: boolean;
  handleProductClick: (product: any) => void;
}) => {
  const [textBefore, restOfText] = message.text?.split("@@SUGGESTIONS START@@") ?? ["", ""];
  
  // If restOfText is empty, ensure textAfter is assigned properly
  const [suggestionText, textAfter] = restOfText ? restOfText.split("@@SUGGESTIONS END@@") : ["", restOfText];


  return (
    <div
      className={`mb-[10px] flex ${
        message.sender === "You" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={` text-white  overflow-hidden`}>
        <div
          className={`${
            message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
          } max-w-[400px] rounded-[8px] p-[8px] `}
        >
          <p>{textBefore}</p>
        </div>

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
                    return suggestionData.products.map((product: any) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)} // Open product modal on click
                        className="product-card flex-shrink-0 flex flex-col items-center w-[300px] bg-gborder p-4 rounded-xl bg-[#1d1d1d] text-yellow-50 h-[320px] gap-5 cursor-pointer"
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
          ): message.suggestions ? (
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
                        onClick={() => handleProductClick(product)} // Open product modal on click
                        className="product-card flex-shrink-0 flex flex-col items-center w-[300px] bg-gborder p-4 rounded-xl bg-[#1d1d1d] text-yellow-50 h-[320px] gap-5 cursor-pointer"
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
          ): null}
          {/* {message.suggestions && (
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
                        onClick={() => handleProductClick(product)} // Open product modal on click
                        className="product-card flex-shrink-0 flex flex-col items-center w-[300px] bg-gborder p-4 rounded-xl bg-[#1d1d1d] text-yellow-50 h-[320px] gap-5 cursor-pointer"
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
          )} */}
        </div>

        {textAfter && (
          <div
            className={`${
              message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
            } max-w-[400px] rounded-[8px] p-[8px] `}
          >
            <div>
              <p>{textAfter}</p>
            </div>
          </div>
        )}

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
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
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
    if (showBrandModal) setShowBrandModal(false);
    else if (showProductModal) setShowProductModal(false);
    router.push("/");
  };
  const handleBrandIconClick = () => {
    setShowBrandModal(true);
  };

  const handleCloseModal = () => {
    setShowBrandModal(false);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="flex flex-col top-0 fixed w-full h-full bg-[#09090b] md:w-[550px] md:h-[75%] md:rounded-[10px] md:bottom-[0px] md:right-[50px] md:top-[20%] shadow-md overflow-hidden z-30">
        {/* Header */}
        <div className="flex justify-between md:justify-between items-center p-[10px]">
          <div className="text-[15px] font-bold flex items-center gap-[15px] text-white">
            <span role="img" aria-label="Back" onClick={handleBack}>
              <Image
                src={"/img/white-back-arrow.svg"}
                alt="Back"
                width={20}
                height={20}
                style={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "10px",
                }}
              />
            </span>
            <Image
              onClick={handleBrandIconClick}
              src={selectedBrand.imageUrl}
              alt="Chat"
              width={20}
              height={20}
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        </div>

        {/* Modals */}
        {showBrandModal && (
          <BrandModal
            selectedBrand={selectedBrand}
            onClose={handleCloseModal}
          />
        )}
        {showProductModal && (
          <ProductModal
            selectedProduct={selectedProduct}
            onClose={handleCloseProductModal}
          />
        )}

        {/* Chat Messages */}
        <>
          <div className="flex-grow overflow-y-auto p-[10px] bg-[#161616]">
            {messages.map((msg, index) => {
              const isLastBotMessage =
                index === messages.length - 1 && msg.sender === "Bunny";
              return (
                <ChatBubble
                  key={index}
                  message={msg}
                  isTyping={isLastBotMessage && isTyping}
                  handleProductClick={handleProductClick}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
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
        </>
      </div>
    </div>
  );
}

const BrandModal = ({
  selectedBrand,
  onClose,
}: {
  selectedBrand: Brand;
  onClose: () => void;
}) => {
  return (
    <div className="flex flex-col p-2.5 fixed bg-black mt-16 w-[550px] h-[605px] rounded-xl overflow-y-auto">
      <div className="p-8 rounded-md w-full">
        <div className="mt-4 text-white"></div>
      </div>
    </div>
  );
};

const ProductModal = ({
  selectedProduct,
}: {
  selectedProduct: any; // This should match the shape of your product data
  onClose: () => void;
}) => {
  return (
    <div className="flex flex-col p-2.5 px-10 fixed bg-black mt-16 w-[550px] h-[605px] rounded-xl overflow-y-auto">
      <div className="text-[15px] font-bold flex flex-col  gap-[15px] text-white">
        <h3 className="text-xl">{selectedProduct.title}</h3>
        <Image
          src={selectedProduct.image_url}
          alt={selectedProduct.title}
          width={80}
          height={80}
          style={{ width: "250px", height: "200px", borderRadius: 20 }}
        />
      </div>
      <div className="rounded-md w-full">
        <div className="mt-4 text-white">
          <h3>{selectedProduct.title}</h3>
          <p>{selectedProduct.description}</p>
          <p>
            <span className="line-through text-[grey]/90 mr-2">
              {selectedProduct.original_price}
            </span>
            <span className="text-green-400">
              {selectedProduct.discounted_price}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
