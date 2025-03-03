"use client";

import createCampaign from "@/app/api/create-campaign";
import api from "@/lib/axiosInstance";
import React, { useState, ChangeEvent, FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineFileUpload } from "react-icons/md";
import { getTrackBackground, Range } from "react-range";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

interface CampaignFormData {
  campaignName: string;
  campaignType: string;
  budget: string;
  titles: string;
  productDetails: string;
  openingMessage: string;
  maxMessagePerChitchat: string;
  category: string;
  region: string;
  faqs: string;
  customInstruction: string;
  media: File | null;
}

const CampaignForm: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [ageRange, setAgeRange] = useState<number[]>([18, 30]);
  const [formData, setFormData] = useState<CampaignFormData>({
    campaignName: "",
    campaignType: "",
    budget: "",
    titles: "",
    productDetails: "",
    openingMessage: "",
    maxMessagePerChitchat: "",
    category: "",
    region: "",
    faqs: "",
    customInstruction: "",
    media: null,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      media: file,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const media = formData.media;

    if (media) {
      try {
        const fileExtension = media.type.split("/")[1];
        const mediaFileName = `brand-first-message-media/${uuidv4()}.${fileExtension}`;

        const r2 = new S3Client({
          region: "auto",
          endpoint: `https://5bb2f8fe15d4eb60ee119ccdb4a19385.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: "7066e5a11028bbb1ef0a0eb0cb52cadd",
            secretAccessKey:
              "314ba0c3ef614075eb304e276a7032f266e46b65115f63e76ba7d4c865cccd21",
          },
        });

        const mediaSignedUrl = await getSignedUrl(
          r2,
          new PutObjectCommand({
            Bucket: "website",
            Key: mediaFileName,
          }),
          { expiresIn: 60 } // URL expiration time (1 minute)
        );

        await fetch(mediaSignedUrl, {
          method: "PUT",
          body: formData.media,
        });

        const mediaPublicUrl = `https://pub-b1946b9de83b4357be05860f410a0024.r2.dev/${mediaFileName}`;

        const createCampaignResponse = await api.post("/chitchats/create", {
          title: formData.titles,
          topics: ["Advices"],
          meta: {
            brand: {
              first_message: formData.openingMessage,
              first_message_media: mediaPublicUrl,
            },
          },
          radius: 15,
          place: "Pragati Nagar",
          latitude: "17.5186",
          longitude: "78.3963",
          is_public: true,
          is_sponsored: true,
        });

        toast.success("Campaign got created successfully");
      } catch (error) {
        console.error("Error generating signed URL:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
        }
        alert(
          "Failed to generate signed URL. Please check the console for more details."
        );
      }
    } else {
      console.log("No media file selected.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-between h-full"
    >
      <div>
        <div className="mb-4">
          <label
            htmlFor="campaignName"
            className="block text-sm font-medium text-gray-300"
          >
            Campaign Name
          </label>
          <input
            type="text"
            id="campaignName"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleInputChange}
            placeholder="Enter campaign name"
            className="mt-1 text-sm flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl p-2  bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
          />
        </div>
        {/* <div className="mb-4">
        <label
          htmlFor="campaignType"
          className="block text-sm font-medium text-gray-300"
        >
          Campaign Type
        </label>
        <div className="relative">
          <select
            id="campaignType"
            name="campaignType"
            value={formData.campaignType}
            onChange={handleInputChange}
            className="w-full bg-[#2d2d2d] border border-[#2d2d2d] text-white rounded-xl p-2 appearance-none focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundImage: "none",
            }}
          >
            <option value="">Select campaign type</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
            <option value="advertisement">Advertisement</option>
            <option value="other">Other</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ▼
          </div>
        </div>
      </div> */}
        {/* <div className="mb-4">
        <label
          htmlFor="budget"
          className="block text-sm font-medium text-gray-300"
        >
          Budget
        </label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          placeholder="Enter budget"
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white focus:outline-none focus:ring-0 "
        />
      </div> */}
        {/* <div className="mb-4 flex gap-5">
        <div className="flex-1">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-300"
          >
            Start Date
          </label>
          <div className=" mt-1 flex-1">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              calendarClassName="custom-datepicker"
              className="flex-1 border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white focus:outline-none focus:ring-0 "
            />
          </div>
        </div>
        <div className="flex-1">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-300"
          >
            End Date
          </label>
          <div className="relative mt-1 w-full">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select End Date"
              calendarClassName="custom-datepicker"
              className="block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
            />
          </div>
        </div>
      </div> */}
        <div className="mb-4">
          <label
            htmlFor="titles"
            className="block text-sm font-medium text-gray-300"
          >
            Title
          </label>
          <input
            type="text"
            id="titles"
            name="titles"
            value={formData.titles}
            onChange={handleInputChange}
            placeholder="Enter titles or headlines"
            className="mt-1 text-sm flex items-center justify-between w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] "
          />
        </div>
        {/* <div className="mb-4">
        <label
          htmlFor="productDetails"
          className="block text-sm font-medium text-gray-300"
        >
          Product Details
        </label>
        <textarea
          id="productDetails"
          name="productDetails"
          value={formData.productDetails}
          onChange={handleInputChange}
          placeholder="Enter product details..."
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white resize-none focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
          rows={3}
        ></textarea>
      </div> */}
        <div className="mb-4">
          <label
            htmlFor="openingMessage"
            className="block text-sm font-medium text-gray-300"
          >
            Opening Message Media
          </label>
          <div className="relative mt-1">
            <input
              type="file"
              id="media"
              name="media"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="absolute text-sm inset-0 opacity-0 w-full h-full cursor-pointer"
            />
            <div
              className="flex items-center bg-gray-700 
              mt-1  w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
            >
              <span className="flex-grow text-sm text-gray-400">
                Attach document here
              </span>
              <MdOutlineFileUpload />
            </div>
          </div>
          {formData.media && (
            <div className="mt-4">
              {formData.media.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(formData.media)}
                  alt="Uploaded Preview"
                  className="w-32 h-32 rounded-[20px]"
                />
              ) : formData.media.type.startsWith("video/") ? (
                <video
                  src={URL.createObjectURL(formData.media)}
                  controls
                  className="max-w-full h-auto rounded-md"
                />
              ) : null}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="openingMessage"
            className="block text-sm font-medium text-gray-300"
          >
            Opening Message
          </label>
          <textarea
            id="openingMessage"
            name="openingMessage"
            value={formData.openingMessage}
            onChange={handleInputChange}
            placeholder="Enter opening message..."
            className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] resize-none "
            rows={5}
          ></textarea>
        </div>
        {/* <div className="mb-4">
        <label
          htmlFor="maxMessagePerChitchat"
          className="block text-sm font-medium text-gray-300"
        >
          Max Messages per Chitchat
        </label>
        <input
          type="number"
          id="maxMessagePerChitchat"
          name="maxMessagePerChitchat"
          value={formData.maxMessagePerChitchat}
          onChange={handleInputChange}
          placeholder="Enter max messages allowed"
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
        />
      </div> */}

        {/* <div className="mb-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-300"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="Enter category"
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
        />
      </div> */}

        {/* <div className="mb-4">
        <label
          htmlFor="region"
          className="block text-sm font-medium text-gray-300"
        >
          Region
        </label>
        <input
          type="text"
          id="region"
          name="region"
          value={formData.region}
          onChange={handleInputChange}
          placeholder="Enter region"
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
        />
      </div> */}

        {/* <div className="mb-4">
        <label className="text-sm font-medium text-gray-300 mb-2 flex justify-between">
          <h1>Age Group:</h1>
          <span>
            {ageRange[0]} - {ageRange[1]}
          </span>
        </label>
        <Range
          step={1}
          min={18}
          max={50}
          values={ageRange}
          onChange={(values) => setAgeRange(values)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "4px",
                width: "100%",
                borderRadius: "4px",
                background: getTrackBackground({
                  values: ageRange,
                  colors: ["#292828", "#ffffff", "#292828"],
                  min: 18,
                  max: 50,
                }),
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "15px",
                width: "15px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 0 2px rgba(0,0,0,0.5)",
              }}
            />
          )}
        />
      </div> */}

        {/* <div className="mb-4">
        <label
          htmlFor="faqs"
          className="block text-sm font-medium text-gray-300"
        >
          FAQs
        </label>
        <textarea
          id="faqs"
          name="faqs"
          value={formData.faqs}
          onChange={handleInputChange}
          placeholder="Enter frequently asked questions..."
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white resize-none focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
          rows={3}
        ></textarea>
      </div> */}

        {/* <div className="mb-4">
        <label
          htmlFor="customInstruction"
          className="block text-sm font-medium text-gray-300"
        >
          Custom Instruction
        </label>
        <textarea
          id="customInstruction"
          name="customInstruction"
          value={formData.customInstruction}
          onChange={handleInputChange}
          placeholder="Enter custom instructions..."
          className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-[#2d2d2d] text-white resize-none focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
          rows={3}
        ></textarea>
      </div> */}
      </div>
      <button
        type="submit"
        className="w-full bg-[#2d2d2d] text-white py-2 rounded-xl"
      >
        Run
      </button>
    </form>
  );
};

export default CampaignForm;
