"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { FaHome, FaCog } from "react-icons/fa";
import Configure from "../../../public/assets/svg/Configure";
// import Campaigns from "../../../public/assets/svg/Campaigns";
// import BillingAndPayments from "../../../public/assets/svg/BillingAndPayments";
// import CreateCampaigns from "../../../public/assets/svg/CreateCampaigns";
// import Help from "../../../public/assets/svg/Help";
// import SmartAssist from "../../../public/assets/svg/SmartAssist";
import AroundMe from "../../../public/assets/svg/AroundMe";
// import MuscleBlaz from "@/public/assets/muscle blaze logo.png";
import Image from "next/image";
import useBrandStore from "@/store/useBrandStore";

const brandName = "Muscle blaze";

// Define primary nav items along with their routes.
const primaryItems = [
  { title: "Around Me", icon: <AroundMe />, route: "/" },
  { 
    title: brandName, 
    icon: <></>, 
    route: "/brand/profile", // navigation link will always point to this route
    activeRoutes: ["/brand/profile", "/brand/add-product"] // both routes count as active
  },

];

// Define sub nav items with an explicit route for each.
// For example, "Configure" uses "/marketing", and the rest follow the "/marketing/[slug]" pattern.
const subcomponent = [
  { title: "Configure", icon: <Configure />, route: "/brand/configure" },
  // { title: "Create", icon: <CreateCampaigns />, route: "/brand/create" },
  // { title: "Campaigns", icon: <Campaigns />, route: "/brand/campaigns" },
  // {
  //   title: "Billings and payments",
  //   icon: <BillingAndPayments />,
  //   route: "/brand/billings-and-payments",
  // },
  // {
  //   title: "Smart assist",
  //   icon: <SmartAssist />,
  //   route: "/brand/smart-assist",
  // },
  // { title: "Help", icon: <Help />, route: "/brand/help" },
];

const Navbar = () => {
  const pathname = usePathname();
  const logo = useBrandStore((state) => state.logo);

  return (
    <div className="group fixed top-0 left-0 h-screen w-16 hover:w-64 bg-[#1d1d1d] text-white transition-all duration-300 overflow-hidden z-50">
      <div className="flex flex-col mt-4 px-2 gap-5">
        {/* Primary Navigation */}
        <div>
          {primaryItems.map((item, index) => {
           const active = item.activeRoutes
           ? item.activeRoutes.includes(pathname)
           : pathname === item.route;
            return (
              <Link href={item.route} key={`primary-${index}`}>
                <div className="flex items-center h-16 transition-colors cursor-pointer overflow-hidden">
                  <div
                    className={`flex items-center p-2 rounded-[12px] transition-all cursor-pointer w-full max-h-[50px] hover:bg-[#133E9F]/80 
                      ${
                        index === 1
                          ? !active
                            ? "bg-[#5A5A5A]/50"
                            : "bg-[#133E9F]/80"
                          : "pl-[3px] p-[5px]"
                      }
                    
                    `}
                  >
                    {index === 0 ? (
                      <div className="text-2xl">{item?.icon}</div>
                    ) : (
                      <Image
                        src={logo || "https://storage.aroundme.global/avatar_default.png"}
                        alt="Muscle Blaze Logo"
                        width={30}
                        height={30}
                        className="rounded-[5px]"
                      />
                    )}

                    <span
                      className={`ml-4 hidden group-hover:inline-block transition-opacity duration-300 whitespace-nowrap`}
                    >
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sub Navigation */}
        <div>
          {subcomponent.map((item, index) => {
            const active = pathname === item.route;
            return (
              <Link href={item.route} key={`sub-${index}`}>
                <div className="flex items-center h-16 transition-colors cursor-pointer overflow-hidden">
                  <div
                    className={`flex items-center p-3 rounded-[12px] transition-all cursor-pointer w-full ${
                      active
                        ? "bg-[#133E9F]/80"
                        : "bg-[#133E9F]/10 hover:bg-[#133E9F]/80"
                    }`}
                  >
                    <div className="text-xl">{item.icon}</div>
                    <span className="ml-4 hidden group-hover:inline-block transition-opacity duration-300 whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
