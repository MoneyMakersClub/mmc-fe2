import React, { useState, useEffect } from "react";
import { get, post } from "../../api/example";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../components/common/PageLayout";
import SearchComponent from "../../components/common/SearchComponent";
import HomeReviewCard from "../../components/MainPage/HomeReviewCard";
import ButtonComponent from "../../components/common/ButtonComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const DATA_LIMIT = 10;

const SelectReviewPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [reviewId, setReviewId] = useState();
  const [cardData, setCardData] = useState({
    cardType: "ONELINE",
  });

  const handleSearch = () => {
    setSearchQuery(search);
  };

  // 검색어 변경 처리 
  const handleSearchChange = (value) => {
    setSearch(value);
    if (value === "") {
      setSearchQuery(""); // 검색어가 비워지면 검색 결과도 초기화
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["reviews", searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await get(
        `/readingspace/onelines/search?keyword=${searchQuery}&page=${pageParam}&size=${DATA_LIMIT}`
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
    <PageLayout
      hasHeader={true}
      headerProps={{ title: "한줄평 카드 위젯" }}
    >
      <div className="pb-4">
        <SearchComponent
          placeholder="제목이나 작가로 검색하세요"
          search={search}
          setSearch={handleSearchChange}
          onEnter={handleSearch}
          custom={true}
        />
      </div>
      <div className="flex flex-col gap-4 px-5 mb-24">
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
        <div className="fixed bottom-0 w-full max-w-[64rem] h-[5.5rem] px-4 pt-[0.37rem] bg-white border-t border-gray-100">
          <ButtonComponent
            text="완료"
            type="primary"
            disabled={!reviewId}
            onClick={handleSubmitClick}
          />
        </div>
      )}
    </PageLayout>
  );
};

export default SelectReviewPage;
