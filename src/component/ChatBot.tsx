"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SwipeableViews from "react-swipeable-views";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

const BASE_URL = "https://fastapi.aroundme.tech";

interface Brand {
  name: string;
  imageUrl: string;
}

interface ChatPageProps {
  selectedBrand: Brand;
}

interface Message {
  id: string;
  message: string;
  sender: string;
  user_id: number;
}

export default function ChatPage({ selectedBrand }: ChatPageProps) {
  useEffect(() => {
    if (selectedBrand) {
      console.log(`Selected brand: ${selectedBrand.name}`);
      console.log(`Brand image: ${selectedBrand.imageUrl}`);
      // Handle the selected brand's name and image here
    }
  }, [selectedBrand]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [anonymousUserId, setAnonymousUserId] = useState("");
  const [quickQuestions, setQuickQuestions] = useState([
    "What is this app about?",
    "What are the features of the app?",
    "Will the app be free to use?",
    "Tell me about the app's privacy policy.",
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [fetchingMessage, setFetchingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = uuidv4();
    setAnonymousUserId(userId);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const addMessage = (sender: string, message: string, user_id: number) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: uuidv4(), sender, message, user_id }, // Add id here
    ]);
  };

  // fetch previous message
  useEffect(() => {
    setFetchingMessage(true);
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/anonymous-conversations/list`,
          {
            method: "GET",
            credentials: "include", // Ensure cookies are sent with the request
          }
        );

        setFetchingMessage(false);

        if (response.ok) {
          const data = await response.json();

          const { messages: fetchedMessages } = data;
          const reversedMessages = fetchedMessages.slice().reverse();
          setMessages(reversedMessages);
        } else {
          setFetchingMessage(false);
          console.log("Failed to fetch messages:", response.statusText);
        }
      } catch (error) {
        setFetchingMessage(false);
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;
    addMessage("You", inputValue, Number(anonymousUserId));
    setInputValue("");

    setIsTyping(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/anonymous-conversations/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: inputValue,
          }),
        }
      );

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        // addMessage("Bunny", data.message.message);
        addMessage("Bunny", data.message.message, 1);
      } else {
        const errorData = await response.json(); // Log or inspect this
        console.error("API Error:", errorData);
        // addMessage("Bunny", "Sorry, there was an error processing your request.");
        addMessage(
          "Bunny",
          "Sorry, there was an error processing your request.",
          1
        );
      }
    } catch (error) {
      setIsTyping(false);
      console.error("Request Error:", error);
      addMessage(
        "Bunny",
        "Sorry, there was an error processing your request.",
        1
      );
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  const handleQuickQuestion = async (question: string): Promise<void> => {
    setQuickQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q !== question)
    );
    setInputValue(question);
    addMessage("You", question, Number(anonymousUserId));

    setInputValue("");

    setIsTyping(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/anonymous-conversations/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            message: question,
          }),
        }
      );

      setIsTyping(false);

      if (response.ok) {
        const data = await response.json();
        // addMessage("Bunny", data.message.message);
        addMessage("Bunny", data.message.message, 1);
      } else {
        addMessage(
          "Bunny",
          "Sorry, there was an error processing your request.",
          1
        );
      }
    } catch (error) {
      console.log(error);

      setIsTyping(false);
      addMessage(
        "Bunny",
        "Sorry, there was an error processing your request.",
        1
      );
    }
  };

  const renderMessage = (msg: Message, index: number) => (
    <div
      ref={messagesEndRef}
      key={index}
      className={
        msg.user_id === 1 // Chatbot messages
          ? "bg-[#1d1d1d] text-white p-2.5 rounded-[10px] mb-2.5 self-start max-w-[80%] break-words"
          : "bg-[#4f46e5] text-white p-2.5 rounded-[10px] mb-2.5 ml-auto self-end max-w-max break-words"
      }
    >
      <ReactMarkdown>{msg.message}</ReactMarkdown>
      {msg.message.includes("Instagram") && (
        <>
          <a
            href="https://instagram.com/aroundme_app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/img/follow-on-insta-cta.svg"
              alt="Join Instagram"
              width={150}
              height={100}
            />
          </a>
          <div style={{ height: "5px" }}></div>
        </>
      )}
    </div>
  );

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div>
      <div className="flex flex-col top-0 fixed w-full h-full bg-[#09090b] md:w-[400px] md:h-[75%] md:rounded-[10px] md:bottom-[0px] md:right-[50px] md:top-[20%] shadow-md overflow-hidden z-30 border-2 ">
        <div className="flex justify-between md:justify-between items-center p-[10px] border-b-[1px]">
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

        <div
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
        </div>
        <SwipeableViews className="no-scrollbar">
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
        </SwipeableViews>
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
