"use client";
import api from "@/lib/axiosInstance";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import useBrandStore from "@/store/useBrandStore";
import { useRouter } from "next/navigation";

interface Props {
  email: string;
  onChangeEmail: () => void;
}

export default function OtpVerification({ email, onChangeEmail }: Props) {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const setEmail = useBrandStore((state) => state.setEmail);
  const setBrandId = useBrandStore((state) => state.setBrandId);
  // Countdown Timer Logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const Otp = otp.join("");
      const response = await api.post(`/brands/login`, {
        email,
        otp: Otp,
      });
      
      if (response.data.token) {
        Cookies.set("authToken", response.data.token, {
          expires: 365,
          secure: true, // Ensure it's only sent over HTTPS
          sameSite: "Strict", // Prevent CSRF attacks
          path: "/", // Makes it available across the site
        });
        setBrandId(response.data.id)
        // window.location.href = "/brand/profile";
        router.push('/brand/profile')
      }
    } catch (error) {
      setEmail(email);
      router
      // window.location.href = "/create-account";
      router.push('/create-account')
      toast.error(" OTP is invalid.Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-authBackground px-4">
      <div className="w-full max-w-md rounded-2xl bg-authCard p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white">Verify your Email</h2>
        <p className="mt-1 text-gray-400">
          Enter the code we sent to{" "}
          <span className="text-gray-300">{email}</span>
        </p>
        <button onClick={onChangeEmail} className="text-blue-400 mt-1 text-sm">
          Change
        </button>

        {/* OTP Input Fields */}
        <div className="mt-4 flex justify-start gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength={1}
              className="w-12 h-12 rounded-xl border  bg-[#302F2F] text-white text-center text-xl focus:border-gray-400 outline-none"
            />
          ))}
        </div>

        {/* Resend Timer */}
        <p className="mt-2 text-sm text-gray-400">
          Resend verification code{" "}
          <span className="font-semibold text-white">
            {timer > 0 ? `00:${timer}` : ""}
          </span>
        </p>

        {/* Resend Button */}
        <button
          className={`mt-2 text-sm ${
            isResendDisabled ? "text-gray-500" : "text-blue-400"
          }`}
          onClick={() => {
            if (!isResendDisabled) {
              setTimer(59);
              setResendDisabled(true);
            }
          }}
          disabled={isResendDisabled}
        >
          Resend Code
        </button>

        {/* Verify Button */}
        <button
          className="mt-4 w-full rounded-xl bg-gray-600 px-4 py-3 text-white font-semibold hover:bg-gray-500 transition"
          onClick={handleVerifyOtp}
          disabled={!otp.every((digit) => digit !== "")}
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
          Verify
        </button>
      </div>
    </div>
  );
}
