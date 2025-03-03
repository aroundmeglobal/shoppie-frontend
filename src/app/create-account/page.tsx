"use client";
import { useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import useBrandStore from "@/store/useBrandStore";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import createGeneralWorkSpace from "@/lib/createGeneralWorkSpace";

export default function RegisterPage() {
  const router = useRouter();
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [gstCertificate, setGstCertificate] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const email = useBrandStore((state) => state.email);
  const setLogoInStore = useBrandStore((state) => state.setLogo);
  const setBrandName = useBrandStore((state) => state.setBrandName);

  const [brandName, setBrandNameState] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [businessDomain, setBusinessDomainState] = useState(""); 
  const [website, setWebsiteState] = useState(""); 
  const [contactName, setContactNameState] = useState(""); 
  const [contactPhone, setContactPhoneState] = useState(""); 

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBrandLogo(event.target.files[0]);
    }
  };

  const handleGstCertificateUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setGstCertificate(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!brandLogo || !gstCertificate) {
      console.error("Please upload the brand logo and GST certificate.");
      return;
    }

    // Step 1: Fetch the upload URLs for both files
    const response = await fetch("/api/upload", {
      method: "POST",
    });

    const {
      brandLogoUrl,
      gstCertificateUrl,
      brandLogoFileKey,
      gstCertificateFileKey,
    } = await response.json();

    await fetch(brandLogoUrl, {
      method: "PUT",
      body: brandLogo,
    });

    await fetch(gstCertificateUrl, {
      method: "PUT",
      body: gstCertificate,
    });

    const brandLogoPublicUrl = `https://pub-b1946b9de83b4357be05860f410a0024.r2.dev/${brandLogoFileKey}`;
    const gstCertificatePublicUrl = `https://pub-b1946b9de83b4357be05860f410a0024.r2.dev/${gstCertificateFileKey}`;

    const body = {
      name: brandName, 
      email: email,
      description:brandDescription,
      industry: businessDomain, 
      website: website,
      logo: brandLogoPublicUrl,
    };
    console.log(body);

    // const brandCreateResponse = await api.post("/users/create-brand", body);
    // const brandCreateResponse = await api.post("/brands", body);

    // console.log(brandCreateResponse.data);

    setLogoInStore(brandLogoPublicUrl);
    setBrandName(brandName);

    // await createGeneralWorkSpace(
    //   brandCreateResponse.data.user_id,
    //   brandName,
    //   brandDescription,
    //   businessDomain
    // );

    // window.location.href = "/brand-status";
  };

  return (
    <div className="flex py-10 items-center justify-center bg-authBackground px-4">
      <div className="w-full max-w-lg rounded-2xl bg-authCard px-8 py-5 shadow-lg">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Create an Account 🚀
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Create an account to discover people, join conversations, and grow
          your network.
        </p>

        {/* Brand Logo Upload */}
        <div className="mt-4 flex flex-col items-center">
          <label htmlFor="logo-upload" className="cursor-pointer">
            <div className="h-20 w-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center bg-authCard">
              {brandLogo ? (
                <img
                  src={URL.createObjectURL(brandLogo)}
                  alt="Brand Logo"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-400">📷</span>
              )}
            </div>
          </label>
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            onChange={handleLogoUpload}
            required
          />
          <p className="mt-2 text-sm text-sky-500 cursor-pointer">
            <span className="text-red-400">*</span> Brand logo
          </p>
        </div>

        {/* Form Fields */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              defaultValue={email}
              className="mt-1 block text-sm w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
              disabled
              required
            />
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-xs font-medium ">
              <span className="text-red-400">*</span> Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              placeholder="Enter Brand Name"
              className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
              required
              value={brandName}
              onChange={(e) => setBrandNameState(e.target.value)} // Update state
            />
          </div>

          <div>
            <label className="block text-xs font-medium ">
              <span className="text-red-400">*</span> Brand Description
            </label>
            <textarea
              id="brandDescription"
              name="brandDescription"
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              placeholder="Enter brand description"
              className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
              rows={4}
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-medium ">
              <span className="text-red-400">*</span> Business domain
            </label>
            <div className="relative mt-1">
              <select
                name="businessDomain"
                className="
                  p-2 bg-transparent text-sm text-white focus:outline-none rounded-xl focus:ring-0 focus:border-[#4d4d4d] w-full  border border-[#2d2d2d] bg-gray-700  pr-10 outline-none  appearance-none"
                value={businessDomain}
                onChange={(e) => setBusinessDomainState(e.target.value)}
              >
                <option className="text-red-500">Select Business domain</option>
                <option>Retail</option>
                <option>Technology</option>
                <option>Healthcare</option>
              </select>
              <FaChevronDown
                size={12}
                className="text-white absolute right-2 top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>
          {/* Website */}
          <div>
            <label className="block text-xs font-medium text-gray-300">
              Website
            </label>
            <input
              type="text"
              name="website"
              placeholder="Enter website URL"
              className="mt-1 block text-sm w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
              value={website}
              onChange={(e) => setWebsiteState(e.target.value)}
            />
          </div>

          {/* Incorporation / GST */}
          <div>
            <label className="block text-xs font-medium ">
              <span className="text-red-400">*</span> Incorporation certificate
              / GST
            </label>
            <div className="relative mt-1">
              <input
                type="file"
                name="gstCertificate"
                id="file-upload"
                className="absolute text-sm inset-0 opacity-0 w-full h-full cursor-pointer"
                onChange={handleGstCertificateUpload}
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
            {gstCertificate && (
              <p className="mt-2 text-sm text-gray-400">
                Selected GST Certificate: {gstCertificate.name}
              </p>
            )}
          </div>

          {/* Contact Person Details */}
          <div>
            <label className="block text-xs font-medium ">
              <span className="text-red-400">*</span> Contact person details
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                name="contactName"
                placeholder="Name"
                className="mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                value={contactName}
                onChange={(e) => setContactNameState(e.target.value)}
              />
              <input
                type="number"
                name="contactPhone"
                placeholder="Phone number"
                className="appearance-none mt-1 text-sm block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
                value={contactPhone}
                onChange={(e) => setContactPhoneState(e.target.value)}
              />
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded-xl border border-neutral-800 bg-red-600 text-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            <label htmlFor="terms" className="text-sm text-white">
              I accept{" "}
              <span className="text-blue-400 cursor-pointer">
                terms and conditions
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-neutral-600 text-sm py-2 text-white font-semibold hover:bg-gray-500 transition"
            // disabled={!acceptedTerms}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
