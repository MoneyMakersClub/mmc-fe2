import React, { useState, useEffect } from "react";
import { get, post } from "../../api/example";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import SearchComponent from "../../components/common/SearchComponent";
import HomeReviewCard from "../../components/MainPage/HomeReviewCard";
import ButtonComponent from "../../components/common/ButtonComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const DATA_LIMIT = 10;

const SelectReviewPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reviewId, setReviewId] = useState();
  const [cardData, setCardData] = useState({
    cardType: "ONELINE",
  });

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", search],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await get(
        `/readingspace/onelines/search?keyword=${search}&page=${pageParam}&size=${DATA_LIMIT}`
      );
      console.log("response", response);
      const reviews = response.pageContent.map((review) => ({
        oneLineId: review.oneLineId,
        oneLineContent: review.oneLineContent,
        rating: review.rating,
        title: review.title,
        author: review.author,
      }));
      return {
        reviews,
        nextPage: pageParam + 1,
        totalPages: response.totalPages || 0,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined,
    initialPageParam: 0,
  });

  // 무한 스크롤 훅 사용
  const { loaderRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const reviews = data?.pages.flatMap((page) => page.reviews) || [];

  // 카드 등록하기
  const postCard = async () => {
    try {
      console.log(cardData);
      const response = await post(`/readingspace`, cardData);
      console.log("Card successfully posted:", response);
    } catch (error) {
      console.error("Error posting card:", error);
    }
  };

  // 카드 데이터 업데이트
  useEffect(() => {
    setCardData((c) => ({ ...c, resourceId1: reviewId }));
  }, [reviewId]);

  //이벤트 핸들러
  const handleSelectCard = (id) => {
    setReviewId(id);
  };

  const handleSubmitClick = async () => {
    await postCard();
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="w-full">
      <NavigationHeader title="한줄평 카드 위젯" />
      <div className="mt-[0.62rem] mb-4">
        <SearchComponent
          placeholder="제목이나 작가로 작성한 카드를 검색하세요"
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="flex flex-col gap-4 px-5">
        {reviews.map((review, index) => (
          <HomeReviewCard
            key={index}
            selected={reviewId === review.oneLineId ? true : false}
            content={review.oneLineContent}
            rating={review.rating}
            title={review.title}
            author={review.author}
            onClick={() => handleSelectCard(review.oneLineId)}
          />
        ))}
        <div ref={loaderRef} style={{ height: "1px" }} />
      </div>
      {reviewId && (
        <div className="fixed bottom-0 w-[24.5625rem] h-[5.5rem] px-4 pt-[0.37rem] bg-white">
          <ButtonComponent
            text="완료"
            type="primary"
            disabled={!reviewId}
            onClick={handleSubmitClick}
          />
        </div>
      )}
    </div>
  );
};

export default SelectReviewPage;
