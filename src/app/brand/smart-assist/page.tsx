import SmartAssist from "@/component/marketing/form/SmartAssistForm";
import React from "react";

const Page = () => {
  return (
    <div >
      {/* Main content container */}
      <div className="ml-20 p-5 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold">Smart assist</h1>
        <div className="flex w-full h-[90vh] mt-5 gap-5">
          {/* Left panel with the form */}
          <div className="w-2/5 bg-[#1d1d1d] rounded-[12px] p-4 overflow-y-auto no-scrollbar ">
            <SmartAssist />
          </div>

          {/* Right panel (empty for now) */}
          <div className="w-3/5 bg-[#1d1d1d] p-4 rounded-[12px] overflow-y-auto">
            {/* Additional content can go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
