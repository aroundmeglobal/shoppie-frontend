"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import api from "@/lib/axiosInstance";
import { MdVerified } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { IoMdArrowUp } from "react-icons/io";
import { Dispatch, SetStateAction } from "react";
import { Brand } from "@/app/page";

const LLM_BASE_URL = process.env.NEXT_PUBLIC_LLM_BASE_URL;
const LLM_AUTH_TOKEN = process.env.NEXT_PUBLIC_LLM_AUTH_TOKEN;


interface ChatPageProps {
  selectedBrand: Brand | null;
  setSelectedBrand: Dispatch<SetStateAction<Brand | null>>;
}



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

const ChatBubble = ({
  message,
  isTyping,
  handleProductClick,
}: {
  message: Message;
  isTyping: boolean;
  handleProductClick: (product: any) => void;
}) => {
  const [textBefore, restOfText] = message.text?.split(
    "@@SUGGESTIONS START@@"
  ) ?? ["", ""];

  // If restOfText is empty, ensure textAfter is assigned properly
  const [suggestionText, textAfter] = restOfText
    ? restOfText.split("@@SUGGESTIONS END@@")
    : ["", restOfText];

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
          ) : message.suggestions ? (
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
          ) : null}
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

export default function ChatPage({
  selectedBrand,
  setSelectedBrand,
}: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  // const [fetchingMessage, setFetchingMessage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    // setFetchingMessage(true);
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
          setMessages(transformedMessages);
        } else {
          console.error("No valid history found in messageData", messageData);
        }
        // setFetchingMessage(false);
      } catch (error) {
        // setFetchingMessage(false);
        console.error("Error fetching messages:", error);
      }
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
    if (selectedBrand) setSelectedBrand(null);
    if (showBrandModal) setShowBrandModal(false);
    else if (showProductModal) setShowProductModal(false);
    // router.push("/");
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
      <div className="flex flex-col top-0 fixed w-full h-full bg-[#282828] md:w-[450px] md:h-[75%] md:rounded-3xl md:bottom-[0px] md:right-[20px] md:top-[22%] shadow-md overflow-hidden z-30">
        {/* Header */}

        {/* Modals */}
        {showBrandModal && (
          <BrandModal
            selectedBrand={selectedBrand}
            onClose={handleCloseModal}
            handleProductClick={handleProductClick}
            // setSelectedProduct={setSelectedProduct}
          />
        )}
        {showProductModal && (
          <ProductModal
            key={selectedProduct?.id}
            selectedBrand={selectedBrand}
            selectedProduct={selectedProduct}
            onClose={handleCloseProductModal}
            handleProductClick={handleProductClick}
          />
        )}

        {/* Chat Messages */}
        <>
          <div className="flex justify-between md:justify-between items-center p-[10px]  bg-[#222222]">
            <div className="text-[15px] font-bold flex items-center gap-[15px] text-white p-1">
              {/* <span role="img" aria-label="Back" onClick={handleBack}>
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
              </span> */}
              <Image
                onClick={handleBrandIconClick}
                src={selectedBrand.imageUrl}
                alt="Chat"
                width={20}
                height={20}
                style={{ width: "50px", height: "50px", borderRadius: "50px" }}
              />
              <div
                onClick={handleBrandIconClick}
                className="text-white text-lg"
              >
                {selectedBrand.name}
              </div>
            </div>
            <span
              role="img"
              aria-label="Back"
              onClick={handleBack}
              className="bg-[#5C5C5C]/50 mr-3 p-1 rounded-full"
            >
              <RxCross2 size={18} />
            </span>
          </div>

          {/* chat bubble */}
          <div className="flex-grow overflow-y-auto p-[10px] bg-[#282828] ">
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
          <div className="flex m-[10px] rounded-xl bg-[#1d1d1d] border-t-[0.1px]-[#1d1d1d] gap-[10px] pr-2.5 items-center">
            <input
              className="flex-grow p-[10px] rounded-[10px] outline-none bg-[#1d1d1d] placeholder:text-[#fff]/20"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              style={{ width: "100%", color: "white" }}
            />
            <button className="cursor-pointer  bg-[#5A5A5A] p-1 rounded-xl ">
              <IoMdArrowUp size={17} onClick={handleSend} />
            </button>
          </div>
        </>
      </div>
    </div>
  );
}

const BrandModal = ({
  selectedBrand,
  onClose,
  handleProductClick,
}: // setSelectedProduct,
{
  selectedBrand: Brand;
  onClose: () => void;
  handleProductClick: (product: any) => void;
  // setSelectedProduct: (product: any) => void;
}) => {
  const [brandDetaile, setBrandDetailes] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [showAllProductModal, setShowAllProductModal] = useState(false);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      try {
        const response = await api.get("/users/brand-details", {
          user_id: 369,
        });
        const data = response.data;
        setBrandDetailes(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProductDetailes = async () => {
      try {
        const response = await api.get(
          "/users/product-details-by-brand?user_id=369"
        );
        const data = response.data;
        setProductDetails(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBrandDetails();
    fetchProductDetailes();
  }, []);

  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain;
    } catch (e) {
      return null;
    }
  };

  const getFavicon = (url: string): string => {
    const domain = extractDomain(url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    // Return a fallback image path if domain is null
    return "/aroundImg.png";
  };
  

  const socialLinks = [
    { name: "Facebook", url: brandDetaile?.meta?.facebook },
    { name: "Instagram", url: brandDetaile?.meta?.instagram },
    { name: "LinkedIn", url: brandDetaile?.meta?.linkedin },
    { name: "Twitter", url: brandDetaile?.meta?.x?.twitter },
    { name: "YouTube", url: brandDetaile?.meta?.youtube },
    { name: "Website", url: brandDetaile?.meta?.website },
  ];

  const handleSeeAllClick = () => {
    setShowAllProductModal(true);
  };

  return (
    <div className="flex flex-col top-0 fixed w-full h-full bg-[#282828]   md:w-[450px] md:h-[75%] md:rounded-3xl md:bottom-[0px] md:right-[20px] md:top-[22%] shadow-md overflow-hidden z-30 overflow-y-auto">
      {/* Brand Modal Header */}
      <div className="flex justify-between md:justify-between items-center ">
        <div className="text-[15px] font-bold flex flex-1 items-center gap-[15px] text-white">
          <span
            role="img"
            aria-label="Back"
            onClick={onClose}
            className=" mt-[-60px] "
          >
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
          <div className="flex flex-1 mt-2 justify-center">
            <div className=" ml-[-50px] flex flex-col gap-2 items-center ">

              <Image
                src={selectedBrand.imageUrl}
                alt="Brand Logo"
                width={20}
                height={20}
                style={{ width: "80px", height: "80px",borderRadius:"40px" }}
              />
              <div className="flex items-center gap-2">
                <div className="text-white text-xl">{selectedBrand.name}</div>
                <MdVerified color="#1E60FB" size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Description */}
      <div className="px-2 py-2">
        <h1 className="text-[#a4a4a4] text-[13px] font-semibold mt-8 font-[BR Firma]">
          Brand Description
        </h1>
        <div className="rounded-xl text-[13px] w-full mt-2 bg-[#1d1d1d] p-[14px] min-h-[55px]">
          <div className=" text-white ">
            <p>{brandDetaile?.meta?.brand_description}</p>
          </div>
        </div>

        {/* Social Media Links */}
        <h1 className="text-[#fff]/50 text-[14px] font-semibold mt-4">
          Socials
        </h1>
        <div className="rounded-xl mt-2 bg-[#1d1d1d] flex items-center p-[14px] min-h-[55px]">
          {socialLinks.map((link, index) =>
            link.url ? (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mr-4"
              >
                <Image
                  src={getFavicon(link.url)}
                  alt={link.name}
                  width={45}
                  height={45}
                  style={{ borderRadius: 50, backgroundColor: "white" }}
                />
              </a>
            ) : null
          )}
        </div>

        {/* Products and See All Button */}
        <div className="text-[#fff] text-[14px] font-semibold mt-4 flex justify-between items-center">
          <h1>Our Products</h1>
          <button onClick={handleSeeAllClick} className="text-white/80">
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mt-4 ">
          {productDetails.slice(0, 4).map((product: any) => (
            <div
              key={product.id}
              className="bg-[#1c1c1c] rounded-xl overflow-hidden "
              onClick={() => {
                handleProductClick(product);
                // setSelectedProduct(product);
              }}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.media[0]}
                  alt={product.title}
                  width={150}
                  height={180}
                  className="w-[100%]"
                />
                <div className="px-3 text-[13px] bg-[#2d2d2d] py-2 w-full">
                  <h3 className="text-white  line-clamp-1">{product.title}</h3>
                  <div>
                    <span className="">₹{product.prices.Discounted_price}</span>
                    <span className=" line-through text-[#a4a4a4] ml-2">
                      ₹{product.prices.Original_price}
                    </span>
                    <span className=" text-[#15CF74] ml-2">
                      {`${Math.round(
                        ((product.prices.Original_price -
                          product.prices.Discounted_price) /
                          product.prices.Original_price) *
                          100
                      )}% Off`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Show All Products Modal */}
      {showAllProductModal && (
        <AllProductModal
          handleProductClick={handleProductClick}
          // setSelectedProduct={setSelectedProduct}
          productDetails={productDetails}
          onClose={() => setShowAllProductModal(false)}
        />
      )}
    </div>
  );
};

const AllProductModal = ({
  productDetails,
  onClose,
  handleProductClick,
}: {
  productDetails: any[];
  onClose: () => void;
  handleProductClick: (product: any) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search input
  const filteredProducts = productDetails.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col top-0 fixed w-full h-full bg-[#282828]   md:w-[450px] md:h-[75%] md:rounded-3xl md:bottom-[0px] md:right-[20px] md:top-[22%] shadow-md overflow-hidden z-30 overflow-y-auto ">
      <div className="flex justify-between md:justify-between items-center ">
        <div className="text-[15px] font-bold flex flex-1 items-center gap-[15px] text-white py-2.5">
          <span role="img" aria-label="Back" onClick={onClose}>
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
          <div className="flex flex-1 justify-center">
            <div className=" ml-[-50px] text-[16px] flex flex-col gap-2 items-center">
              All products
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center rounded-xl items-center m-4 p-[8px] px-[15px] bg-[#1d1d1d]">
        <IoSearchOutline color="#afafaf" size={22} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products"
          className="w-full p-2 bg-[#1d1d1d] text-white placeholder:text-[#afafaf] focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 m-4">
        {filteredProducts.map((product: any) => (
          <div
            key={product.id}
            className="bg-[#1c1c1c] rounded-xl overflow-hidden"
            onClick={() => {
              handleProductClick(product);
            }}
          >
            <div className="flex flex-col items-center">
              <Image
                src={product.media[0]}
                alt={product.title}
                width={150}
                height={150}
                className="w-[100%]"
              />
              <div className="px-3 bg-[#2d2d2d] py-2 w-full">
                <h3 className="text-white text-[13px] line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-[13px]">
                  {product.prices?.Discounted_price && (
                    <span className="font-bold">
                      ₹{product.prices.Discounted_price}
                    </span>
                  )}
                  {product.prices?.Original_price && (
                    <span className="text-[13px] line-through text-[#a4a4a4] ml-2">
                      ₹{product.prices.Original_price}
                    </span>
                  )}
                  <span className=" text-[13px] font-medium text-[#15CF74] ml-2">
                    {`${Math.round(
                      ((product.prices.Original_price -
                        product.prices.Discounted_price) /
                        product.prices.Original_price) *
                        100
                    )}% Off`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductModal = ({
  selectedProduct,
  onClose,
  handleProductClick,
}: {
  selectedProduct: any;
  onClose: () => void;
  handleProductClick: (product: any) => void;
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [productDetails, setProductDetails] = useState<any[]>([]);
  const [showAllProductModal, setShowAllProductModal] = useState(false);

  useEffect(() => {
    const fetchProductDetailes = async () => {
      try {
        const response = await api.get(
          "/users/product-details-by-brand?user_id=369"
        );
        const data = response.data;
        setProductDetails(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductDetailes();
  }, []);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleSeeAllClick = () => {
    setShowAllProductModal(true);
  };

  const getFavicon = (url: string) => {
    const domain = extractDomain(url);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
    return null;
  };

  const extractDomain = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace("www.", ""); // Remove 'www.' part from the domain if needed
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <div className="flex flex-col top-0 fixed w-full h-full bg-[#282828]   md:w-[450px] md:h-[75%] md:rounded-3xl md:bottom-[0px] md:right-[20px] md:top-[22%] shadow-md overflow-hidden z-30 overflow-y-auto">
      <div className="flex items-start w-full mt-3">
        <span role="img" aria-label="Back">
          <Image
            onClick={onClose}
            src={"/img/white-back-arrow.svg"}
            alt="Back"
            width={16}
            height={16}
            style={{
              width: "16px",
              height: "16px",
              margin: "10px",
            }}
          />
        </span>
        <div className="text-[15px] w-[80%] h-[250px] bg-[#1d1d1d] rounded-xl font-bold flex flex-col gap-[15px] text-white p-2 items-center justify-center">
          <Image
            src={selectedProduct.image_url || selectedProduct?.media[0]}
            alt={selectedProduct.title}
            width={80}
            height={80}
            style={{ width: "70%", height: "200px", borderRadius: 20 }}
          />
        </div>
      </div>
      <div className="rounded-md w-full px-6 py-2">
        <div className="mt-2 text-white ">
          <h3 className="text-[18px] font-bold">{selectedProduct.title}</h3>
          <div className="mt-[5px] text-[13px]">
            {!selectedProduct.prices.Original_price ? (
              <div>
                <span className="line-through text-[#a4a4a4] mr-2">
                  {selectedProduct.original_price}
                </span>
                <span className="text-green-400">
                  {selectedProduct.discounted_price}
                </span>
              </div>
            ) : (
              <div>
                <span className="text-[18px] font-bold">
                  ₹{selectedProduct.prices.Discounted_price}
                </span>
                <span className="line-through text-[15px] font-medium text-[#a4a4a4] ml-2">
                  ₹{selectedProduct.prices.Original_price}
                </span>
                <span className=" text-[14.5px] font-medium text-[#15CF74] ml-2">
                  {`${Math.round(
                    ((selectedProduct.prices.Original_price -
                      selectedProduct.prices.Discounted_price) /
                      selectedProduct.prices.Original_price) *
                      100
                  )}% Off`}
                </span>
              </div>
            )}
          </div>
          <div className="text-[13px] text-[white]/80 leading-2 mt-3">
            {showFullDescription
              ? selectedProduct.description
              : `${selectedProduct.description.slice(0, 100)}...`}
            <button
              onClick={toggleDescription}
              className={`text-[#1E60FB] ml-[4px]`}
            >
              {showFullDescription ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full p-2">
        <h1 className="text-[14px] font-semibold m-4">Buy this product through</h1>
        <div className="bg-[#1d1d1d] m-4 rounded-xl flex items-center p-[14px] space-x-4">
          {selectedProduct.purchase_urls.map((url, index) => {
            const faviconUrl = getFavicon(url);
            return (
              <a
                target="blank"
                href={url}
                key={index}
                className="rounded-xl overflow-hidden"
              >
                {faviconUrl && (
                  <Image
                    width={40}
                    height={40}
                    src={faviconUrl}
                    alt="Favicon"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Products and See All Button */}
        <div className="text-[#fff] text-[14px] font-semibold m-4 flex justify-between items-center">
          <h1>Similar products</h1>
          <button onClick={handleSeeAllClick} className="text-white/80">
            See All
          </button>
        </div>
        <div className="flex gap-6 mt-4 ml-4 mb-4 overflow-hidden overflow-x-auto">
          {productDetails.map((product: any) => (
            <button
              key={product.id}
              className="bg-[#1c1c1c] rounded-xl overflow-hidden min-w-[170px]"
              onClick={() => {
                handleProductClick(product);
                console.log("product hit in product model");
              }}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={product.media[0]}
                  alt={product.title}
                  width={150}
                  height={180}
                  className="w-[100%]"
                />
                <div className="px-3 text-[13px] bg-[#2d2d2d] py-2 w-full">
                  <h3 className="text-white  line-clamp-1">{product.title}</h3>
                  <div>
                    <span className="">₹{product.prices.Discounted_price}</span>
                    <span className=" line-through text-[#a4a4a4] ml-2">
                      ₹{product.prices.Original_price}
                    </span>
                    <span className=" text-[#15CF74] ml-2">
                      {`${Math.round(
                        ((product.prices.Original_price -
                          product.prices.Discounted_price) /
                          product.prices.Original_price) *
                          100
                      )}% Off`}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Show All Products Modal */}
      {showAllProductModal && (
        <AllProductModal
          handleProductClick={handleProductClick}
          productDetails={productDetails}
          onClose={() => setShowAllProductModal(false)}
        />
      )}
    </div>
  );
};
