import coverEx from "../../assets/common/book-cover-ex.svg";
import menuBar from "../../assets/common/menu-bar.svg";
import emptyImage from "../../assets/recordingPage/rating-empty.svg";
import filledImage from "../../assets/recordingPage/rating-filled.svg";
import { useState } from "react";
import check from "../../assets/libraryPage/checked.svg";
import not_checked from "../../assets/libraryPage/checked-not.svg";
import downArrow from "../../assets/common/down-arrow.svg";
//edit이 false면 편집 기능 없이 "읽고 있어요" 상태인 책 확인 in 기록할 책 선택 페이지
//edit이 true, dropdown도 true면 상태 선택 가능한 드롭다운 표시
const EditBookListView = ({
  bookTitle = "책제목",
  author = "지은이",
  bookImg,
  isSelected,
  edit,
  addBook,
  rating,
  initState,
}) => {
  return (
    <div
      className={`flex items-center justify-between w-full h-[7.75rem] pb-[0.5rem] pt-[0.5rem] cursor-pointer`}
    >
      <div className="flex gap-[0.75rem] items-center w-[15.75rem] h-[6.75rem]">
        <div className="relative">
          <img
            className="w-[4.75rem] h-[6.75rem]"
            src={bookImg ? bookImg : coverEx}
            alt="coverEx"
          />
          <div className="absolute top-1 left-1">
            <img src={isSelected ? check : not_checked} alt="check" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-b1 text-gray-800">{bookTitle}</div>
          <div className=" text-b1 text-gray-500">{author}</div>
          <div className="flex mt-[0.5rem]">
            {[...Array(5)].map((_, index) => (
              <div key={index}>
                <img
                  key={index}
                  src={index < rating ? filledImage : emptyImage} // 채워진 이미지 또는 비워진 이미지 표시
                  alt="rating"
                  className="" // 이미지 크기 조절
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {edit && (
        <div className="w-[1.5rem] h-[1.5rem] cursor-pointer">
          <img src={menuBar} alt="menuBar" />
        </div>
      )}
      {addBook && (
        <div className="flex">
          <span className="text-btn4 text-gray-500 cursor-pointer">
            {initState}
          </span>
          <img src={downArrow} alt="downArrow" />
        </div>
      )}
    </div>
  );
};
export default EditBookListView;
