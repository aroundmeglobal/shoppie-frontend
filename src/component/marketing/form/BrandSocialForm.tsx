"use client";

import React, { ChangeEvent } from "react";

interface SocialMediaData {
  platform: string;
  imageLink: string;
  placeHolder: string;
  inputValue: string;
}

interface BrandSocialFormProps {
  socialMediaData: SocialMediaData[];
  onChange: (index: number, value: string) => void;
}

const BrandSocialForm: React.FC<BrandSocialFormProps> = ({
  socialMediaData,
  onChange,
}) => {


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 border-l-4 border-[#2A80FF] pl-2">
        Social & Website Links
      </h2>
      <div className="grid grid-cols-3 gap-6 ">
        {socialMediaData.map((data, index) => (
          <div key={index} className="bg-[#1d1d1d] p-4 rounded-xl">
            <h3 className="text-lg font-bold mb-4 text-center">
              {data.platform}
            </h3>
            <div className="flex justify-center items-center mb-7">
              <img
                src={data.imageLink}
                alt={data.platform}
                className="h-16  "
              />
            </div>

            <input
              placeholder={data.placeHolder}
              type="url"
              pattern="https://.*"
              id={`social-input-${index}`}
              value={data.inputValue}
              onChange={(e) => onChange(index, e.target.value)}
              className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#1d1d1d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#A4A4A4] text-center placeholder:text-center placeholder:text-[14px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandSocialForm;
