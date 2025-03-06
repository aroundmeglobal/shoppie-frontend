"use client";

import React, { useState, ChangeEvent, useEffect, useRef, memo } from "react";

import api from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import useBrandStore from "@/store/useBrandStore";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import BrandInfoForm from "./form/BrandInfoForm";
import BrandSocialForm from "./form/BrandSocialForm";
import { stat } from "fs";
import { getBradData } from "@/api/getBradData";

const EditProfile = () => {
  const initialSocialData = [
    {
      platform: "Website",
      imageLink: "/img/website.png",
      placeHolder: "Enter your website URL",
      inputValue: "",
    },
    {
      platform: "Instagram",
      imageLink: "/img/instagram.png",
      placeHolder: "Enter your instagram URL",
      inputValue: "",
    },
    {
      platform: "LinkedIn",
      imageLink: "/img/linkedin.png",
      placeHolder: "Enter your linkedIn URL",
      inputValue: "",
    },
    {
      platform: "X/Twitter",
      imageLink: "/img/twitter.png",
      placeHolder: "Enter your x URL",
      inputValue: "",
    },
    {
      platform: "YouTube",
      imageLink: "/img/youtube.png",
      placeHolder: "Enter your youTube URL",
      inputValue: "",
    },
    {
      platform: "Facebook",
      imageLink: "/img/facebook.png",
      placeHolder: "Enter your facebook URL",
      inputValue: "",
    },
  ];

  const [formData, setFormData] = useState({
    email: "",
    brandName: "",
    brandDescription: "",
    brandDomain: "",
    contactName: "",
    contactMobile: "",
    photo: null as File | null, // Storing the actual File
    meta: {},
    id: "",
  });

  const [isLogoUpdated, setIsLogoUpdated] = useState(false);
  const [socialMediaData, setSocialMediaData] = useState(initialSocialData);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const initialFetchedDataRef = useRef<any>(null);
  const isDataFetchedRef = useRef(false);

  const [brandInfoChanges, setBrandInfoChanges] = useState(0);
  const [socialInfoChanges, setSocialInfoChanges] = useState(0);

  const brandId = useBrandStore((state) => state.brandId);
  const setLogoInStore = useBrandStore((state) => state.setLogo);
  const setBrandName = useBrandStore((state) => state.setBrandName);
  const setBrandDescription = useBrandStore(
    (state) => state.setBrandDescription
  );
  const setBrandDomain = useBrandStore((state) => state.setBrandDomain);
  const setWorkspaceExists = useBrandStore((state) => state.setWorkspaceExists);

  useEffect(() => {
    const fetchBrandDetails = async () => {
      setIsLoading(true);
      try {
        const brandDataResponse = await getBradData(brandId);

        // const response = await api.get(`/brands/`);
        const data = brandDataResponse;
        console.log("data", data);

        initialFetchedDataRef.current = data;
        isDataFetchedRef.current = true;

        setLogoInStore(data.brandData.logo);
        setBrandName(data.brandData.name);
        setBrandDescription(data.brandData.description);
        setBrandDomain(data.brandData.industry);

        if (data.brandData.workspaces && data.brandData.workspaces.length > 0) {
          setWorkspaceExists(true);
        } else {
          setWorkspaceExists(false);
        }
        

        setFormData({
          brandName: data.brandData.name,
          brandDomain: data.brandData.industry,
          contactName: data.contactData.name,
          contactMobile: data.contactData.phone_number,
          // data.phone_number,
          email: data.brandData.email,
          photo: data.brandData.logo, // If logo is a URL, adjust as needed
          brandDescription: data.brandData.description || "",
          meta: {},
          // data.meta,
          id: data.brandData.id,
        });

        const updatedSocialData = [...socialMediaData];
        updatedSocialData.forEach((item) => {
          if (item.platform === "Website")
            item.inputValue = data.brandData?.website || "";
          if (item.platform === "Instagram")
            item.inputValue = data?.brandData?.instagram || "";
          if (item.platform === "LinkedIn")
            item.inputValue = data?.brandData?.linkedin || "";
          if (item.platform === "X/Twitter")
            item.inputValue = data?.brandData["x/twitter"] ?? "";
          if (item.platform === "YouTube")
            item.inputValue = data?.brandData?.youtube || "";
          if (item.platform === "Facebook")
            item.inputValue = data?.brandData?.facebook || "";
        });

        setSocialMediaData(updatedSocialData);
      } catch (err) {
        setApiError("Failed to fetch brand details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandDetails();
  }, []);

  const handleFormInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.[0]) {
      const file = files[0];

      // Store the file object directly
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
      setIsLogoUpdated(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setIsFormChanged(true);
    setBrandInfoChanges((prev) => prev + 1);
  };

  const handleSocialInputChange = (index: number, value: string) => {
    const updatedData = [...socialMediaData];
    updatedData[index].inputValue = value;
    setSocialMediaData(updatedData);
    setIsFormChanged(true);
    setSocialInfoChanges((prev) => prev + 1);
  };

  const isSaveEnabled = brandInfoChanges >= 1 || socialInfoChanges >= 1;

  const handleSave = async () => {
    setIsFormChanged(false);
    setBrandInfoChanges(0);
    setSocialInfoChanges(0);

    let hasInvalidUrl = false;

    const updatedSocialMediaData = socialMediaData.map((item) => {
      const value = item.inputValue;
      if (value) {
        const isValidUrl = /^(https?:\/\/)/.test(value);
        if (!isValidUrl) {
          toast.error(`${item.platform} URL is invalid.`);
          hasInvalidUrl = true;
          return { ...item, inputValue: "" };
        }
      }
      return item;
    });

    setSocialMediaData(updatedSocialMediaData);

    if (hasInvalidUrl) {
      return;
    }

    const socialMeta = updatedSocialMediaData.reduce((acc, item) => {
      acc[item.platform.toLowerCase()] = item.inputValue;
      return acc;
    }, {});

    const updatedMeta = {
      ...formData.meta,
      brand_description: formData.brandDescription,
      ...socialMeta,
    };

    let mediaPublicUrl;
    const media = formData.photo;

    if (isLogoUpdated && media) {
      const fileExtension = media.type.split("/")[1];
      console.log(fileExtension);

      // Generate a unique file name and upload
      const mediaFileName = `brand-logos/${uuidv4()}.${fileExtension}`;

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
        body: media,
      });

      mediaPublicUrl = `https://pub-b1946b9de83b4357be05860f410a0024.r2.dev/${mediaFileName}`;
    }

    console.log(mediaPublicUrl);

    try {
      await api.put("/users/update-brand", {
        user_id: formData.user_id,
        brand_name: formData.brandName,
        domain: formData.brandDomain,
        website: updatedSocialMediaData.find(
          (item) => item.platform === "Website"
        )?.inputValue,
        logo: mediaPublicUrl || formData.photo,
        name: formData.brandName,
        phone_number: formData.contactMobile,
        meta: updatedMeta,
      });

      setLogoInStore(mediaPublicUrl || formData.photo);
      toast.success("Successfully updated.");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to update data, please try again.");
    }
  };

  return (
    <div>
      <div className="p-5 pt-0  h-full">
        <div className="flex flex-col mt-3 px-28 gap-10 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <svg
                className="animate-spin h-10 w-10 text-blue-500"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            </div>
          ) : apiError ? (
            <div>{apiError}</div>
          ) : (
            <div className="bg-[#161616] rounded-2xl">
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-xl font-bold mb-6 border-l-4 border-[#2A80FF] pl-2">
                  Brand Info
                </h2>
                <div
                  className={` py-2 px-4 mt-[-10px] rounded-2xl ${
                    isSaveEnabled
                      ? "cursor-pointer bg-[#00AFFE]"
                      : "cursor-not-allowed flex items-center justify-between border border-[#2d2d2d] rounded-xl py-2 px-4 bg-[#1d1d1d] text-yellow-50 focus:outline-none focus:ring-0 focus:border-[#4d4d4d] hover:bg-[#4d4d4d]"
                  }`}
                >
                  <button onClick={handleSave} disabled={!isSaveEnabled}>
                    Save
                  </button>
                </div>
              </div>
              <div>
                <BrandInfoForm
                  formData={formData}
                  onChange={handleFormInputChange}
                />
              </div>
              <div className="mt-10">
                <BrandSocialForm
                  socialMediaData={socialMediaData}
                  onChange={handleSocialInputChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EditProfile);
