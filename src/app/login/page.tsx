"use client";

import Navbar from "@/component/Navbar";
import OtpVerification from "@/component/OtpVerification";
import { loginImage } from "@/constants";
import api from "@/lib/axiosInstance";
import useBrandStore from "@/store/useBrandStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [email, setEmail] = useState("");
  const [isOtpScreen, setOtpScreen] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setEmailInStore = useBrandStore((state) => state.setEmail);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; // Standard email validation regex
    return regex.test(email);
  };

  const handleGetOtp = async () => {
    if (!email) {
      setEmailError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      const body = {
        email: `${email}`,
      };
      const response = await api.post(
        `${process.env.NEXT_PUBLIC_DEVBASEURL}/brands/otp/email/send`,
        body
      );

      if (response.status === 200) {
        toast.success("OTP sented to email");
        setEmailInStore(email);
        setOtpScreen(true);
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }

    setEmailError("");
  };

  useEffect(() => {
    if (email.length > 1) {
      if (validateEmail(email)) {
        const domain = email.split("@")[1];
        if (domain && domain.toLowerCase() === "gmail.com") {
          setIsEmailValid(false);
          setEmailError(
            "Business emails are required. Gmail addresses are not allowed."
          );
        } else {
          setIsEmailValid(true);
          setEmailError("");
        }
      } else {
        setIsEmailValid(false);
        setEmailError("Please enter a valid email address.");
      }
    } else {
      setIsEmailValid(false);
      setEmailError("");
    }
  }, [email]);

  if (isOtpScreen) {
    return (
      <OtpVerification
        email={email}
        onChangeEmail={() => setOtpScreen(false)}
        handleGetOtp={handleGetOtp}
      />
    );
  }

  return (
    <main className="bg-[url(/login-background.png)] bg-fixed bg-cover min-h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center overflow-hidden mx-2 ">
        <div className="w-[900px] flex rounded-2xl overflow-hidden shadow-lg h-[25rem]">
          {/* Left Section */}
          <div className="md:w-1/2 w-full gap-2  text-white p-8 bg-authCard  flex-col  flex h-full  justify-center ">
            <h2 className="text-xl text-white font-bold">Login / Signup</h2>
            <p className=" text-[#cacaca] mt-1 text-[13px] font-extralight font-[BR Firma] ">
              Create an account to discover people, join conversations, and grow
              your network.
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Business Email
              </label>
              <input
                type="email"
                id="campaignName"
                name="campaignName"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="Enter business email"
                className="mt-1  block w-full border border-[#2d2d2d] focus:bg-none rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d] placeholder:text-[#5a5a5a] placeholder:text-sm"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            <button
              onClick={handleGetOtp}
              className={`mt-4 w-full rounded-2xl px-4 py-2 text-white  transition ${
                isEmailValid || isLoading
                  ? "bg-sky-500 hover:bg-sky-500"
                  : "bg-[#5a5a5a] hover:bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!isEmailValid || isLoading}
            >
              {isLoading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  ></path>
                </svg>
              )}
              Get OTP
            </button>
          </div>

          {/* Right Section */}
          <div className="w-1/2 bg-[#1f1f1f] md:flex hidden relative">
            <Image
              src={loginImage}
              width={500}
              height={400}
              priority
              alt="A person logging in"
              style={{ width: "auto", height: "auto" }}
              className="object-cover aspect-auto w-full h-full"
            />
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <main className="bg-[url(/login-background.png)] bg-fixed bg-cover ">
      <Navbar />
      <div className="flex items-center justify-center w-[800px] bg-green-300">
        <div className=" w-1/2 flex min-h-screen items-center justify-center  px-4 ">
          <div className="w-full max-w-md rounded-2xl bg-authCard p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white">Login / Signup</h2>
            <p className="mt-1 text-gray-400">
              Create an account to discover people, join conversations, and grow
              your network.
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="campaignName"
                name="campaignName"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="mt-1 block w-full border border-[#2d2d2d] rounded-xl p-2 bg-transparent text-white focus:outline-none focus:ring-0 focus:border-[#4d4d4d]"
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Get OTP Button */}
            <button
              onClick={handleGetOtp}
              className={`mt-4 w-full rounded-xl px-4 py-3 text-white font-semibold transition ${
                isEmailValid || isLoading
                  ? "bg-sky-500 hover:bg-sky-500"
                  : "bg-[#2d2d2d] hover:bg-gray-500 cursor-not-allowed"
              }`}
              disabled={!isEmailValid || isLoading}
            >
              {isLoading && (
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="#1C64F2"
                  ></path>
                </svg>
              )}
              Get OTP
            </button>
          </div>
        </div>
        <div className="w-1/2 bg-gray-500"></div>
      </div>
    </main>
  );
};

export default Page;
