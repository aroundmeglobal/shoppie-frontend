import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FAQ } from "../../types";

// Enhance your store interface to clearly define the shape of your store
interface BrandStoreState {
  email: string;
  logo: string;
  brandName: string;
  userId: string;
  brandDescription: string;
  brandDomain: string;
  faqs: FAQ[];
  customInstruction: string;

  setEmail: (newEmail: string) => void;
  setBrandName: (newBrandName: string) => void;
  setLogo: (newLogo: string) => void;
  setUserId: (newUserId: string) => void;
  setBrandDescription: (newBrandDescription: string) => void;
  setBrandDomain: (newBrandDomain: string) => void;
  setFaqs: (newFaqs: FAQ[]) => void;
  setCustomInstruction: (newCustomInstruction: string) => void;
}

const useBrandStore = create<BrandStoreState>()(
  persist(
    (set) => ({
      // Initial state
      email: "",
      logo: "",
      brandName: "",
      userId: "",
      brandDescription: "",
      brandDomain: "",
      faqs: [],
      customInstruction: "",

      // Setters
      setEmail: (newEmail) => set({ email: newEmail }),
      setBrandName: (newBrandName) => set({ brandName: newBrandName }),
      setLogo: (newLogo) => set({ logo: newLogo }),
      setUserId: (newUserId) => set({ userId: newUserId }),
      setBrandDescription: (newBrandDescription) =>
        set({ brandDescription: newBrandDescription }),
      setBrandDomain: (newBrandDomain) => set({ brandDomain: newBrandDomain }),
      setFaqs: (newFaqs) => set({ faqs: newFaqs }),
      setCustomInstruction: (newCustomInstruction) =>
        set({ customInstruction: newCustomInstruction }),
    }),
    {
      name: "brand-storage", // Key for localStorage
    }
  )
);

export default useBrandStore;
