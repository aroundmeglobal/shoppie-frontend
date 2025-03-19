import { create } from "zustand";

interface CsvStoreState {
  selectedCsv: File | null; // Ensure this is a File object
  setSelectedCsv: (selectedCsv: File | null) => void;
}

const useCsvStore = create<CsvStoreState>((set) => ({
  selectedCsv: null, // Initial state: no CSV file selected
  setSelectedCsv: (newCsv) => set({ selectedCsv: newCsv }),
}));

export default useCsvStore;
