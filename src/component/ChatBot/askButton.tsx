import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

interface Type {
  onClick: () => void;
}

export default function AskButton({ onClick }: Type) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex items-center justify-center h-7 w-7  text-black bg-white font-bold  rounded-[10px]"
    >
      <IoChatbubbleEllipsesOutline />
    </button>
  );
}
