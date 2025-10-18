import { useState } from "react";
import { post } from "../api/example";

const useAddToLibrary = () => {
  const [showAddToLibraryModal, setShowAddToLibraryModal] = useState(false);

  const addToLibrary = async (providerId, bookData) => {
    try {
      const requestBody = {
        title: bookData.title,
        author: bookData.author,
        imgPath: bookData.imgPath,
        readStatus: "NOT_STARTED", // 기본값으로 "읽고 싶어요" 설정
      };
      await post(`/bookinfo/${providerId}/add`, requestBody);
      return true;
    } catch (error) {
      console.error("서재에 책 추가 실패:", error);
      throw error;
    }
  };

  const showModal = () => {
    setShowAddToLibraryModal(true);
  };

  const hideModal = () => {
    setShowAddToLibraryModal(false);
  };

  return {
    showAddToLibraryModal,
    addToLibrary,
    showModal,
    hideModal,
  };
};

export default useAddToLibrary;


