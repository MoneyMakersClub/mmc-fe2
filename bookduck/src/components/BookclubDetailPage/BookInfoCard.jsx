import { useState, useEffect } from "react";
import down from "../../assets/common/down-arrow.svg";
import BottomSheetModal from "../common/modal/BottomSheetModal";
import BookStatusModal from "../common/BookStatusModal";
import { patch, del, post } from "../../api/example";
import { getReadingStatusKor, getReadingStatusKey, statusArr } from "../../utils/bookStatus";

const BookInfoCard = ({ clubData, getStatusText, formatDate, onRefresh, onBookClick }) => {
  const [currentState, setCurrentState] = useState(
    clubData?.userBookId ? (getReadingStatusKor(clubData?.readStatus) || "읽고 싶어요") : "서재 담기"
  );
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isCancel, setCancel] = useState(true);

  useEffect(() => {
    if (clubData?.userBookId && clubData?.readStatus) {
      setCurrentState(getReadingStatusKor(clubData.readStatus));
    } else if (!clubData?.userBookId) {
      setCurrentState("서재 담기");
    }
  }, [clubData?.readStatus, clubData?.userBookId]);

  const handleStatusClick = async () => {
    // 항상 모달 표시 (서재 담기든 상태 변경이든)
    setBottomSheetShow(true);
  };

  const handleStatusChange = async (status) => {
    setCurrentState(status);
    
    if (clubData?.userBookId) {
      // 기존 책 상태 변경
      try {
        const statusKey = getReadingStatusKey(status);
        await patch(`/books/${clubData.userBookId}?status=${statusKey}`);
        setVisible(false);
        setTimeout(() => {
          setBottomSheetShow(false);
        }, 200);
        // 데이터 새로고침
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("책 상태 변경 업데이트 오류:", error);
      }
    } else {
      // 서재에 새로 추가
      try {
        const providerId = clubData.clubBookInfo.providerId;
        const statusKey = getReadingStatusKey(status);
        await post(`/bookinfo/${providerId}/add?readStatus=${statusKey}`);
        setVisible(false);
        setTimeout(() => {
          setBottomSheetShow(false);
        }, 200);
        // 데이터 새로고침
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("서재 추가 오류:", error);
        alert("서재에 책을 추가하는 데 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handlePutCancel = async () => {
    if (clubData?.userBookId) {
      try {
        await del(`/books/${clubData.userBookId}`);
        setCurrentState("서재 담기");
        setVisible(false);
        setTimeout(() => {
          setBottomSheetShow(false);
        }, 200);
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("서재담기 취소 오류:", error);
      }
    }
  };

  return (
    <div className="relative flex bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* 책 이미지 */}
      <div className="w-[4.75rem] h-[7rem] mr-3 flex-shrink-0 cursor-pointer" onClick={onBookClick}>
        <img 
          src={clubData.clubBookInfo?.bookImgPath} 
          alt={clubData.clubBookInfo?.bookTitle}
          className="w-full h-full object-cover rounded-[0.25rem]"
        />
      </div>

      {/* 북클럽 정보 */}
      <div className="flex-1 flex flex-col justify-between h-[7rem]">
        <div className="flex flex-col h-full cursor-pointer" onClick={onBookClick}>
          <h3 className="text-b1 text-gray-800 line-clamp-2 mb-1 flex-shrink-0">
            {clubData.clubBookInfo?.bookTitle}
          </h3>
          
          {/* 작가 */}
          <p className="text-b2 text-gray-500 mb-2 flex-shrink-0">
            {clubData.clubBookInfo?.bookAuthor}
          </p>
        </div>
        
        {/* 책 상태 수정 또는 서재 담기 */}
        <div
          className="flex py-1.5 text-b2 text-gray-500 cursor-pointer flex-shrink-0"
          onClick={handleStatusClick}
        >
          {currentState}
          <img src={down} className="ml-1" />
        </div>
      </div>

      {/* 상태 변경 바텀시트 */}
      {bottomSheetShow && (
        <BottomSheetModal
          bottomSheetShow={bottomSheetShow}
          setBottomSheetShow={setBottomSheetShow}
          visible={visible}
          setVisible={setVisible}
        >
          <BookStatusModal
            currentStatus={clubData?.readStatus}
            onStatusChange={handleStatusChange}
            onDelete={handlePutCancel}
            showDelete={true}
          />
        </BottomSheetModal>
      )}
    </div>
  );
};

export default BookInfoCard;


