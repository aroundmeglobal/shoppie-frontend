import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FAQ } from "../../types";

// Enhance your store interface to clearly define the shape of your store
interface BrandStoreState {
  email: string;
  logo: string;
  brandName: string;
  brandId: string;
  brandDescription: string;
  brandDomain: string;
  faqs: FAQ[];
  customInstruction: string;
  workspaceExists: boolean;

  setEmail: (newEmail: string) => void;
  setBrandName: (newBrandName: string) => void;
  setLogo: (newLogo: string) => void;
  setBrandId: (newBrandId: string) => void;
  setBrandDescription: (newBrandDescription: string) => void;
  setBrandDomain: (newBrandDomain: string) => void;
  setFaqs: (newFaqs: FAQ[]) => void;
  setCustomInstruction: (newCustomInstruction: string) => void;
  setWorkspaceExists: (newWorkspaceExists: boolean) => void;
}

const useBrandStore = create<BrandStoreState>()(
  persist(
    (set) => ({
      // Initial state
      email: "",
      logo: "",
      brandName: "",
      brandId: "",
      brandDescription: "",
      brandDomain: "",
      faqs: [],
      customInstruction: "",
      workspaceExists: false,

      // Setters
      setEmail: (newEmail) => set({ email: newEmail }),
      setBrandName: (newBrandName) => set({ brandName: newBrandName }),
      setLogo: (newLogo) => set({ logo: newLogo }),
      setBrandId: (newBrandId) => set({ brandId: newBrandId }),
      setBrandDescription: (newBrandDescription) =>
        set({ brandDescription: newBrandDescription }),
      setBrandDomain: (newBrandDomain) => set({ brandDomain: newBrandDomain }),
      setFaqs: (newFaqs) => set({ faqs: newFaqs }),
      setCustomInstruction: (newCustomInstruction) =>
        set({ customInstruction: newCustomInstruction }),
      setWorkspaceExists: (newWorkspaceExists) => set({ workspaceExists : newWorkspaceExists }),
    }),
    {
      name: "brand-storage", // Key for localStorage
    }
  )
);

export default useBrandStore;
