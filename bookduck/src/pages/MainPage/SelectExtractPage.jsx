import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../api/example";
import NavigationHeader from "../../components/common/NavigationHeader";
import SearchComponent from "../../components/common/SearchComponent";
import ExtractCard from "../../components/MainPage/ExtractCard";
import ButtonComponent from "../../components/common/ButtonComponent";

const SelectExtractPage = () => {
  //상태 관리
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [excerpts, setExcerpts] = useState([]);
  const [excerptId, setExcerptId] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [cardData, setCardData] = useState({
    cardType: "EXCERPT",
  });

  const loaderRef = useRef(null);
  const DATA_LIMIT = 10;

  //API 연결
  //발췌 리스트 받아오기
  const getExcerpts = async (keyword, page = 0) => {
    try {
      const response = await get(
        `/readingspace/excerpts/search?keyword=${keyword}&page=${page}&size=${DATA_LIMIT}`
      );

      console.log("response", response);
      const data = response.pageContent.map((excerpt) => ({
        author: excerpt.author,
        excerptContent: excerpt.excerptContent,
        excerptId: excerpt.excerptId,
        visibility: excerpt.visibility,
        pageNumber: excerpt.pageNumber,
        title: excerpt.title,
      }));

      if (page === 0) {
        // 첫 페이지인 경우 기존 데이터 초기화
        setExcerpts(data);
      } else {
        // 다음 페이지 데이터를 추가
        setExcerpts((prev) => [...prev, ...data]);
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

  // useEffect 훅
  // 검색어 변경 시 데이터 초기화 및 첫 페이지 호출

  useEffect(() => {
    console.log("excerpts", excerpts);
  }, [excerpts]);

  useEffect(() => {
    if (search) {
      setExcerpts([]); // 기존 데이터 초기화
      setCurrentPage(0); // 첫 페이지로 초기화
      getExcerpts(search, 0);
    }
  }, [search]);

  useEffect(() => {
    getExcerpts("", 0);
  }, []);

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
      getExcerpts(search, currentPage);
    }
  }, [currentPage, search]);

  //카드 데이터 업데이트
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
            <ExtractCard
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
