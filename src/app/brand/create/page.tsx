import BrandGeneralIntelligneceChat from "@/component/marketing/BrandGeneralIntelligneceChat";
import CreateForm from "@/component/marketing/form/CreateForm";
import React from "react";

const Page = () => {
  return (
    <div>
      {/* Main content container */}
      <div className="ml-20 px-5 overflow-y-auto h-screen bg-[#000">
        <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
          Create Campaign
        </h1>
        <div className="w-full h-[85%] gap-5 mt-8 flex items-center justify-center  no-scrollbar">
          {/* Left panel with the form */}
          <div className="w-1/3 h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar">
            <CreateForm />
          </div>

          {/* Right panel (empty for now) */}
          <div className="w-2/3 h-full bg-[#161616] rounded-xl overflow-hidden">
          <BrandGeneralIntelligneceChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
