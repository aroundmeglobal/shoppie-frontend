// "use client";

// import React, { useEffect, useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getWorkspaceHistory } from "@/api/getWorkspaceHistory";
// import { v4 as uuidv4 } from "uuid";
// import { ChatBubble } from "@/component/ChatBubble";

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export default function Page({ params }: PageProps) {
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const { data, error, isLoading } = useQuery({
//     queryKey: ["workspaceHistory", params.id],
//     queryFn: async () => {
//       const messageData = await getWorkspaceHistory(params.id);
//       const history = messageData?.history;
//       if (Array.isArray(history)) {
//         return history.map((msg: any) => ({
//           id: uuidv4(),
//           message: msg.content, // message content
//           sender: msg.role === "user" ? "You" : "Bunny", // determine sender
//           user_id: msg.role === "user" ? 1 : 2,
//           text: msg.content,
//         }));
//       }
//       throw new Error("No valid history found");
//     },
//   });

//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [data]);

//   if (isLoading) return <div>Loading chat history...</div>;
//   if (error) return <div>Error: {(error as Error).message}</div>;

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">
//         Workspace History for {params.id}
//       </h1>
//       <div className="space-y-4">
//         {(data || []).map((msg: any) => (
//           <ChatBubble
//             key={msg.id}
//             message={msg}
//             isTyping={false}
//             handleProductClick={() => {}}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SwipeableViews from "react-swipeable-views";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { ChatBubble } from "@/component/ChatBubble";
import { getWorkspaceHistory } from "@/api/getWorkspaceHistory";

// A helper function to choose the correct image source based on theme.
const getImageSrc = (imgSrc: string, whiteImgSrc?: string, theme = "dark") =>
  theme === "dark" ? (whiteImgSrc || imgSrc) : imgSrc;

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
  const theme = "dark"; // or derive from context

  // Use React Query to fetch workspace history.
  const { data, error, isLoading, refetch } = useQuery({
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

  // Auto-scroll to the bottom when data (messages) update.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // Handler for the Back button.
  const handleBack = () => {
    router.push("/");
  };

  // Handler for sending a message.
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const messageToSend = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    try {
      // Post your message to the API endpoint.
      const response = await fetch(`/api/workspace/${params.id}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });
      if (!response.ok) {
        console.error("Error sending message:", response.statusText);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
    setIsTyping(false);
    // After sending, refetch the conversation history.
    await refetch();
  };

  // Handle Enter key press in the input field.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSend();
  };



  // A helper to render each message using your custom ChatBubble.
  const renderMessage = (msg: any, index: number) => (
    <ChatBubble
      key={msg.id || index}
      message={msg}
      isTyping={false}
      handleProductClick={() => {}}
    />
  );

  return (
    <div>
      <div className="flex flex-col top-0 fixed w-full h-full bg-[#09090b] md:w-[400px] md:h-[75%] md:rounded-[10px] md:bottom-[90px] md:right-[20px] md:top-[10%] shadow-md overflow-hidden z-30 ">
        {/* Top Bar */}
        <div className="flex justify-between md:justify-between items-center p-[10px] border-b-[1px]">
          <div className="text-[15px] font-bold flex gap-[15px] text-white">
            <span role="img" aria-label="Back" onClick={handleBack}>
              <Image
                src={getImageSrc("/img/white-back-arrow.svg", undefined, theme)}
                alt="Back"
                width={100}
                height={100}
                style={{ width: "40px", height: "50px", marginLeft: "10px" }}
              />
            </span>
            <Image
              src={getImageSrc("/img/bunny-icon-new.svg", undefined, theme)}
              height={100}
              width={100}
              alt="Chat"
              style={{ width: "200px", height: "50px", marginLeft: "10px" }}
            />
            <Image
              src={getImageSrc("/img/Bunny_text.svg", undefined, theme)}
              height={100}
              width={100}
              alt="Chat"
              style={{ width: "70px", height: "50px", marginRight: "45px" }}
            />
          </div>
          <div className="flex justify-center mt-2.5 mb-2.5">
            <a
              href="https://instagram.com/aroundme_app"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2.5 my-0 "
            >
              <Image
                src={getImageSrc("/img/follow-on-insta.svg", undefined, theme)}
                alt="Instagram"
                width={180}
                height={100}
              />
            </a>
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
          {data && data.map(renderMessage)}
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
        <div className="flex p-[10px] bg-[#09090b] border-t gap-[10px]">
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
