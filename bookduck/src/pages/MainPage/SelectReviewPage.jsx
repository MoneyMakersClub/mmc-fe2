import React, { useState, useEffect, useRef } from "react";
import { get, post } from "../../api/example";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import SearchComponent from "../../components/common/SearchComponent";
import HomeReviewCard from "../../components/MainPage/HomeReviewCard";
import ButtonComponent from "../../components/common/ButtonComponent";

const SelectReviewPage = () => {
  //상태 관리
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewId, setReviewId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const loaderRef = useRef(null);
  const DATA_LIMIT = 10;
  const [cardData, setCardData] = useState({
    cardType: "ONELINE",
  });

  //API 연결
  //리뷰 리스트 받아오기
  const getReviews = async (keyword, page = 0) => {
    try {
      const response = await get(
        `/readingspace/onelines/search?keyword=${keyword}&page=${page}&size=${DATA_LIMIT}`
      );
      console.log("response", response);
      const data = response.pageContent.map((review) => ({
        oneLineId: review.oneLineId,
        oneLineContent: review.oneLineContent,
        rating: review.rating,
        title: review.title,
        author: review.author,
      }));
      if (page === 0) {
        // 첫 페이지인 경우 기존 데이터 초기화
        setReviews(data);
      } else {
        // 다음 페이지 데이터를 추가
        setReviews((prev) => [...prev, ...data]);
      }

      setTotalPages(response.totalPages || 0); // 서버에서 전체 페이지 수 반환
    } catch (error) {
      console.error(error);
    }
  };

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

  //useEffect 훅
  useEffect(() => {
    console.log("reviews", reviews);
  }, [reviews]);

  useEffect(() => {
    if (search) {
      setReviews([]); // 기존 데이터 초기화
      setCurrentPage(0); // 첫 페이지로 초기화
      getReviews(search, 0);
    }
  }, [search]);

  // 무한 스크롤 감지
  useEffect(() => {
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && currentPage < totalPages) {
        console.log("다음 페이지 로드");
        setCurrentPage((p) => p + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport 사용
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [currentPage, totalPages]);

  // 현재 페이지 데이터 로드
  useEffect(() => {
    if (currentPage > 0 && search) {
      console.log(`페이지 ${currentPage} 데이터 로드`);
      getBooks(search, currentPage);
    }
  }, [currentPage, search]);

  //카드 데이터 업데이트
  useEffect(() => {
    setCardData((c) => ({ ...c, resourceId1: reviewId }));
  }, [reviewId]);

  useEffect(() => {
    getReviews("", 0);
  }, []);

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
