"use client";

import React, { ChangeEvent } from "react";
import { FaCamera, FaPen } from "react-icons/fa";

interface FormData {
  email: string;
  brandName: string;
  brandDescription: string;
  brandDomain: string;
  contactName: string;
  contactMobile: string;
  photo: File | null;
}

interface BrandInfoFormProps {
  formData: FormData;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BrandInfoForm: React.FC<BrandInfoFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <form className="p-5">
     

      {/* Upload Photo */}
      <div className="flex flex-col items-center mb-6">
        <label
          htmlFor="photo"
          className="cursor-pointer flex flex-col items-center"
        >
          {formData.photo ? (
            formData.photo?.type?.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Uploaded Preview"
                className="w-32 h-32 rounded-[20px]"
              />
            ) : formData.photo?.type?.startsWith("video/") ? (
              <video
                src={URL.createObjectURL(formData.photo)}
                controls
                className="max-w-full h-auto rounded-md"
              />
            ) : (
              <img
                src={formData.photo}
                alt="Uploaded Photo"
                className="w-40 h-40 rounded-full object- border-2 border-dashed border-[#3d3d3d]"
              />
            )
          ) : (
            <div className="w-40 h-40 rounded-full border-2 border-dashed border-[#3d3d3d] flex items-center justify-center">
              <FaCamera size={24} className="text-gray-400" />
            </div>
          )}

          {/* Pencil Icon */}
          <div className="ml-28 mt-[-40px] bg-[#3d3d3d] p-2 rounded-full">
            <FaPen size={16} className="top-50 text-gray-400 cursor-pointer" />
          </div>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={onChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="gap-6 flex flex-col">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-[16px] font-semibold text-[#FAFAFA]"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            // REMOVE THIS LINE: onChange={onChange}
            placeholder="Enter email"
            className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#1d1d1d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
            readOnly // Optional: Add readOnly attribute for visual indication
          />
        </div>

        {/* Brand Name */}
        <div>
          <label
            htmlFor="brandName"
            className="block text-[16px] font-semibold text-[#FAFAFA]"
          >
            Brand Name:
          </label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={onChange}
            placeholder="Enter brand name"
            className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#1d1d1d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
          />
        </div>

        {/* Brand Description */}
        <div>
          <label
            htmlFor="brandDescription"
            className="block text-[16px] font-semibold text-[#FAFAFA]"
          >
            Brand Description:
          </label>
          <textarea
            id="brandDescription"
            name="brandDescription"
            value={formData.brandDescription}
            onChange={onChange}
            placeholder="Enter brand description"
            className="mt-1 block w-full border resize-none border-[#2d2d2d] rounded-xl p-2 bg-[#1d1d1d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
            rows={4}
          ></textarea>
        </div>

        {/* Brand Domain */}
        <div>
          <label
            htmlFor="brandDomain"
            className="block text-[16px] font-semibold text-[#FAFAFA]"
          >
            Brand Domain:
          </label>
          <input
            type="text"
            id="brandDomain"
            name="brandDomain"
            value={formData.brandDomain}
            onChange={onChange}
            placeholder="Enter brand domain"
            className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#1d1d1d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
          />
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-[16px] font-semibold text-[#FAFAFA]">
            Contact Person Details:
          </label>
          <div className="flex space-x-4">
            <div className="w-full">
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={onChange}
                placeholder="Enter contact person's name"
                className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#1d1d1d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
              />
            </div>
            <div className="w-full">
              <input
                type="text"
                id="contactMobile"
                name="contactMobile"
                value={formData.contactMobile}
                onChange={onChange}
                placeholder="Enter mobile number"
                className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2  text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d bg-[#1d1d1d]"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BrandInfoForm;
