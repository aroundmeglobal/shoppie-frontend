import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

interface Type {
  onClick: () => void;
  width?: number;
  height?: number;
}

export default function AskButton({ onClick,width=7,height=7 }: Type) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex items-center justify-center h-${height} w-${width}  text-black bg-white font-bold  rounded-[10px]`}
    >
      <IoChatbubbleEllipsesOutline size={18} />
    </button>
  );
}
