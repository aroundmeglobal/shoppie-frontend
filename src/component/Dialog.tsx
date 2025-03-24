"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { TbLogout2 } from "react-icons/tb";

interface DialogeProps {
  isOpen: boolean;
  loader: boolean;
  setIsOpen: (isOpen: boolean) => void;
  secondFunction: () => void;
}
export default function Dialog({
  isOpen,
  loader,
  setIsOpen,
  secondFunction,
}: DialogeProps) {
  useEffect(() => {
    if (loader) {
      toast.loading("Logging out...");
    }
    return () => toast.remove();
  }, [loader]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-sm bg-opacity-50">
          <div className="bg-[#1d1d1d] rounded-xl shadow-lg p-6 w-96">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-[#2d2d2d] rounded-full">
                <TbLogout2 size={30} className="text-red-500" />
              </div>
              <h2 className="text-lg font-semibold mt-4">
                Logout confirmation
              </h2>
              <p className="text-white text-center mt-2">
                Are you sure you want to logout?
              </p>
            </div>
            <div className="flex justify-between mt-8 gap-5 ">
              <button
                disabled={loader}
                onClick={() => setIsOpen(false)}
                className="px-4 w-full py-2 text-sm font-medium text-white border-[1px] rounded-[8px]"
              >
                Cancel
              </button>
              <button
                disabled={loader}
                onClick={secondFunction}
                className="px-4 w-full py-2 text-sm font-medium text-white rounded-[8px] bg-red-500  "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
