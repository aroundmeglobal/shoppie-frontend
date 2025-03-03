"use client";

import React, { useEffect, useState } from "react";
import ConfigureForm from "@/component/marketing/form/ConfigureForm";
import BrandGeneralIntelligneceChat from "@/component/marketing/BrandGeneralIntelligneceChat";
import checkWorkspaceExistence from "@/lib/checkWorkspaceExistence";
import useBrandStore from "@/store/useBrandStore";
import { GrConfigure } from "react-icons/gr";

const Page = () => {
  const [workspaceExist, setWorkspaceExist] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = useBrandStore((state) => state.userId);
  const workspaceSlug = `${userId}`; // Example dynamic slug

  useEffect(() => {
    const checkWorkspace = async () => {
      const exists = await checkWorkspaceExistence("369");
      setWorkspaceExist(exists);
      setLoading(false);
    };

    checkWorkspace();
  }, [workspaceSlug]);

  if (loading) {
    return (
      <div className="ml-20 p-5 pt-10 overflow-y-auto h-screen">
        <h1 className="text-2xl font-bold">Configure</h1>
        <div className="flex w-full h-[88vh] mt-5 gap-5">
          <div className="w-full h-[80vh] bg-gradient-to-r from-[#000]  via-[#1d1d1d] to-[#000] animate-shimmer rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main content container */}
      <div className="ml-20 px-5 overflow-y-auto h-screen bg-[#000">
        <h1 className="text-2xl font-bold py-5 sticky top-0 bg-[#000] border-b-2">
          Configure
        </h1>
        <div className="w-full h-[85%] gap-5 mt-8 flex items-center justify-center  no-scrollbar">
          <div className="w-1/3 h-full overflow-y-auto overflow-hidden bg-[#161616] rounded-[12px] p-6 no-scrollbar">
            <ConfigureForm />
          </div>

          <div className="w-2/3 h-full bg-[#161616] rounded-xl overflow-hidden">
            {workspaceExist ? (
              <BrandGeneralIntelligneceChat />
            ) : (
              <div className="flex items-center flex-col gap-10 w-full h-full justify-center">
                <h1 className="text-3xl font-bold mt-[-10vh]">
                  Configure your brand to start using bot
                </h1>
                <GrConfigure size={200} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
