import { Brand } from "@/app/page";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Enhance your store interface to clearly define the shape of your store
interface BrandStoreState {
  brand: Brand;
  setBrand: (newBrand: Brand) => void;
}

const useSelectedBrandStore = create<BrandStoreState>()(
  persist(
    (set) => ({
      // Initial state
      brand: { name: "", imageUrl: "", description: "", tags: [""] },

      // Setters
      setBrand: (newBrand) => set({ brand: newBrand }),
    }),
    {
      name: "brand-storage", // Key for localStorage
    }
  )
);

export default useSelectedBrandStore;
