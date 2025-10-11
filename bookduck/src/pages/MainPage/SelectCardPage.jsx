import React from "react";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import HomeExcerptCard from "../../components/MainPage/HomeExcerptCard";
import HomeReviewCard from "../../components/MainPage/HomeReviewCard";
import BookDisplay from "../../components/MainPage/BookDisplay";

const SelectCardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <NavigationHeader title="위젯 선택" />

      <div className="flex flex-col gap-[0.38rem] pt-[calc(env(safe-area-inset-top)+2.75rem+1.44rem)] px-5 pb-[2.19rem]">
        <p className="text-st text-black">추가할 위젯 유형을 선택해주세요</p>
        <p className="text-b2 text-gray-500">
          음악은 자유롭게 메모할 수 있는 빈 카드로 바꿀 수 있어요
        </p>
      </div>
      <div className="flex flex-col gap-5 px-5">
        <div
          onClick={() =>
            navigate("/selectcard/custom", { state: { bookNumber: 1 } })
          }
        >
          <BookDisplay display={true} />
        </div>
        <div
          onClick={() =>
            navigate("/selectcard/custom", { state: { bookNumber: 2 } })
          }
        >
          <BookDisplay display={true} bookNumber={2} />
        </div>
        <HomeExcerptCard onClick={() => navigate("/selectcard/extract")} />
        <HomeReviewCard onClick={() => navigate("/selectcard/review")} />
      </div>
    </div>
  );
};

export default SelectCardPage;
