import { create } from "zustand";

const useBookInfoStore = create((set) => ({
  bookInfo: {},
  setBookInfo: (newState) => set({ bookInfo: newState }),
  selectedBookInfo: null,
  setSelectedBookInfo: (bookInfo) => set({ selectedBookInfo: bookInfo }),
  clearBookInfo: () => set({ selectedBookInfo: null }),
}));

export default useBookInfoStore;
