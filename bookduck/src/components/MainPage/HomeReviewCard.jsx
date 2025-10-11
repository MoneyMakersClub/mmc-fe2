import React from "react";
import emptyImage from "../../assets/recordingPage/rating-empty.svg";
import filledImage from "../../assets/recordingPage/rating-filled.svg";
const HomeReviewCard = ({
  cardId,
  cardIndex,
  selected,
  content,
  rating,
  title,
  author,
  onClick,
}) => {
  return (
    <div
      className={`flex w-full flex-col px-4 py-3 bg-gray-10 shadow-custom h-[6rem] justify-between rounded-[0.75rem]  ${
        selected && " border-[1px] border-[#6B7FF0]"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-row">
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <img
              key={index}
              src={index <= rating ? filledImage : emptyImage} // 채워진 이미지 또는 비워진 이미지 표시
              alt="rating"
              className="" // 이미지 크기 조절
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[0.38rem]">
        <p className="text-b2 text-gray-800">
          {content || "한줄평 카드 위젯을 만들어보세요"}
        </p>
        <p className="text-c1 text-gray-400">
          {title || "제목"} / {author || "작가"}
        </p>
      </div>
    </div>
  );
};

export default HomeReviewCard;
