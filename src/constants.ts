import { ColorCategory } from "../types";

export const loginImage =
  "https://pub-8c1bb6e7c1dc4de9a9c50ab4d399094d.r2.dev/person-using-ar-technology-perform-their-occupation.jpg";

export const colorCategories: ColorCategory[] = [
  {
    category: "Widget body",
    fields: [
      { label: "Background Color", name: "bgColor" },
      { label: "Chat Header Background Color", name: "headerColor" },
      { label: "Text Header Color", name: "textHeaderColor" },
      { label: "Input Bar Color", name: "inputbarColor" },
      { label: "Input Text Color", name: "InputTextColor" },
    ],
  },
  {
    category: "Display Message UI",
    fields: [
      {
        label: "Display Message Background Color",
        name: "startingMessageTheme",
      },
      {
        label: "Display Message Text Color",
        name: "openingMessageTextColor",
      },
    ],
  },
  {
    category: "Customer UI",
    fields: [
      { label: "Message Bubble Color", name: "userBgColor" },
      { label: "Message Text Color", name: "userTextColor" },
    ],
  },
  {
    category: "Assistant UI",
    fields: [
      { label: "Asisstant Chat Bubble Color", name: "assistantBgColor" },
      { label: "Asisstant Message Text Color", name: "botTextColor" },
    ],
  },
  {
    category: "Product Card",
    fields: [
      { label: "Card Background Color", name: "cardBgColor" },
      { label: "Card Title Text Color", name: "cardTextColor" },
      { label: "Card SubTitle Text Color", name: "cardTextSubColour" },
    ],
  },
];

export const chatData = [
  {
    type: "message",
    text: "Hey there! 🌟 How can I help you find your perfect For you product today?",
    fromAI: true,
  },
  { type: "message", text: "Hey! suggest me some products", fromAI: false },
  {
    type: "message",
    text: "Absolutely! You’re in for a treat with our amazing products designed just for you! 🌟 Here are some top picks:",
    fromAI: true,
  },
  {
    type: "product",
    name: "Biozyme Performance Whey Protein",
    image: "https://via.placeholder.com/150",
    price: "₹2499",
    original: "₹2949",
    fromAI: false,
  },
  {
    type: "suggestion",
    text: "Tell me more about this product",
    fromAI: false,
    suggestion: true,
  },
  {
    type: "suggestion",
    text: "What are the benifits of this product?",
    fromAI: false,
  },
];
