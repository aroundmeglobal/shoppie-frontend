import Image from "next/image";
import ReactMarkdown from 'react-markdown';

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


export const ChatBubble = ({
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

  const [suggestionText, textAfter] = restOfText
    ? restOfText.split("@@SUGGESTIONS END@@")
    : ["", restOfText];

  return (
    <div
      className={`mb-[10px] flex ${
        message.sender === "You" ? "justify-end" : "justify-start"
      }`}
    >
      <div className={`text-white overflow-hidden`}>
        <div
          className={`${
            message.sender === "You" ? "bg-[#1E60FB]" : "bg-[#1d1d1d]"
          } max-w-[400px] rounded-[8px] p-[8px] `}
        >
          <ReactMarkdown
            children={textBefore}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold mt-4 mb-2 text-white" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-semibold mt-3 mb-1 text-white/70" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-semibold mt-2 mb-1 text-white/" {...props} />
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
        </div>

        {textAfter && (
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
                    <h1 className="text-2xl font-bold mt-4 mb-2 text-white" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-semibold mt-3 mb-1 text-white/70" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold mt-2 mb-1 text-white/" {...props} />
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
        )}

        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
};
