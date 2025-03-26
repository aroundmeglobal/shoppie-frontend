import { MdInfoOutline } from "react-icons/md";
import AnalyticsCardShimmer from "../Shimmers/analyticsCardShimmer";

interface CardProps {
  card: {
    title: string;
    no: number;
    description: string;
  };
}
export default function AnalyticCard({ card }: CardProps) {
  if (card.no === undefined) {
    return <AnalyticsCardShimmer />;
  }
  return (
    <div
      key={Math.random()}
      className="cursor-pointer w-1/3 h-[160px] max-w-[calc(33.333%-1.25rem)] bg-[#161616] flex flex-col justify-between p-4 rounded-xl shadow-md relative  -z-1"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl w-full">{card.title} </h3>
        <div className=" w-full group absolute  ">
          <div className="relative flex justify-end group mr-7">
            <MdInfoOutline
              className="cursor-pointer"
              size={25}
              color="#5d5d5d"
            />
            <div
              role="tooltip"
              className="tooltip absolute bottom-full right-0 mb-2 px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-[#2d2d2d] rounded-[13px] shadow-xs opacity-0 group-hover:opacity-100 pointer-events-none"
            >
              {card.description}
              <div className="absolute top-0   right-2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-[#2d2d2d]" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-5xl font-medium">{card.no}</p>
    </div>
  );
}
