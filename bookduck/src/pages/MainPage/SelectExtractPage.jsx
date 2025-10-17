import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../api/example";
import NavigationHeader from "../../components/common/NavigationHeader";
import SearchComponent from "../../components/common/SearchComponent";
import HomeExcerptCard from "../../components/MainPage/HomeExcerptCard";
import ButtonComponent from "../../components/common/ButtonComponent";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const DATA_LIMIT = 10;

const SelectExtractPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [excerptId, setExcerptId] = useState();
  const [cardData, setCardData] = useState({
    cardType: "EXCERPT",
  });

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["excerpts", search],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await get(
        `/readingspace/excerpts/search?keyword=${search}&page=${pageParam}&size=${DATA_LIMIT}`
      );
      console.log("response", response);
      const excerpts = response.pageContent.map((excerpt) => ({
        author: excerpt.author,
        excerptContent: excerpt.excerptContent,
        excerptId: excerpt.excerptId,
        visibility: excerpt.visibility,
        pageNumber: excerpt.pageNumber,
        title: excerpt.title,
      }));
      return {
        excerpts,
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

  const excerpts = data?.pages.flatMap((page) => page.excerpts) || [];

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
    setCardData((c) => ({ ...c, resourceId1: excerptId }));
  }, [excerptId]);

  //이벤트 핸들러
  const handleSelectCard = (id) => {
    setExcerptId(id);
  };

  const handleSubmitClick = async () => {
    await postCard();
    navigate("/home");
    window.location.reload();
  };

  return (
    <div className="w-full">
      <NavigationHeader title="발췌 카드 위젯" />
      <div className="mt-[0.62rem] mb-4">
        <SearchComponent
          placeholder="기록한 발췌 카드를 검색하세요"
          search={search}
          setSearch={setSearch}
        />
      </div>
      <div className="flex flex-col gap-4 px-5">
        {excerpts.length > 0 &&
          excerpts.map((excerpt, index) => (
            <HomeExcerptCard
              key={index}
              onClick={() => handleSelectCard(excerpt.excerptId)}
              selected={excerptId === excerpt.excerptId ? true : false}
              content={excerpt.excerptContent}
              visibility={excerpt.visibility}
              pageNumber={excerpt.pageNumber}
              title={excerpt.title}
              author={excerpt.author}
            />
          ))}
        <div ref={loaderRef} style={{ height: "1px" }} />
      </div>
      {excerptId && (
        <div className="fixed bottom-0 w-[24.5625rem] h-[5.5rem] px-4 pt-[0.37rem] bg-white">
          <ButtonComponent
            text="완료"
            type="primary"
            disabled={!excerptId}
            onClick={handleSubmitClick}
          />
        </div>
      )}
    </div>
  );
};

export default SelectExtractPage;
