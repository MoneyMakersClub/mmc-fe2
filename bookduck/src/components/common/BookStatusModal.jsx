import React from "react";
import check from "../../assets/common/check.svg";
import trash from "../../assets/common/trash.svg";
import { getReadingStatusKor, statusArr } from "../../utils/bookStatus";

const BookStatusModal = ({
  currentStatus,
  onStatusChange,
  onDelete,
  showDelete = false,
}) => {
  return (
    <div className="flex flex-col gap-3 mb-[1.75rem]">
      <div className="text-st text-gray-800 font-semibold px-4">책 상태</div>
      
      {statusArr.map((status, index) => {
        const isSelected = getReadingStatusKor(currentStatus) === status;
        
        return (
          <div key={index}>
            <div
              className="flex flex-row justify-between items-center w-full py-3 px-4 cursor-pointer"
              onClick={() => onStatusChange(status)}
            >
              <div
                className={`text-b2 ${
                  isSelected ? "text-orange-400" : "text-gray-500"
                }`}
              >
                {status}
              </div>
              {isSelected && <img src={check} alt="check-icon" />}
            </div>
            {index < statusArr.length - 1 && (
              <div className="px-4">
                <div className="h-[0.0625rem] bg-gray-50"></div>
              </div>
            )}
          </div>
        );
      })}
      
      {showDelete && (
        <div className="px-4 mt-4">
          <div
            onClick={onDelete}
            className="flex items-center gap-1 w-full h-[3rem] px-4 py-3 bg-gray-10 rounded-[0.5rem] cursor-pointer"
          >
            <img src={trash} className="w-6 h-6" />
            <span className="text-btn3 text-gray-500">서재담기 취소</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookStatusModal;
