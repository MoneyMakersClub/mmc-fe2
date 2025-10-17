import React, { useState, useEffect, useRef } from "react";
import ReviewComponent from "./ReviewComponent";
import BottomSheetModal from "../common/modal/BottomSheetModal";
import ListBottomSheet from "../common/ListBottomSheet";
import downArrow from "../../assets/common/down-arrow.svg";
import { get } from "../../api/example";
import ExcerptComponent from "./ExcerptComponent";
import SuspenseLoading from "../common/SuspenseLoading"; // 로딩 컴포넌트 추가

const sortingArr = ["정확도순", "최신순"];
const DATA_LIMIT = 10;
const getSortKey = (sort) => {
  switch (sort) {
    case "정확도순":
      return "accuracy";
    case "최신순":
      return "latest";
    default:
      return "Error";
  }
};

const SearchArchiveComponent = ({ search }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [archives, setArchives] = useState([]);
  const [sort, setSort] = useState("정확도순");
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const loaderRef = useRef(null);

  /* API - 기록 받아오기 */
  const getArchives = async (search, page) => {
    if (!search) return setArchives([]);
    try {
      setIsLoading(true); // 로딩 시작
      const response = await get(
        `/archives/search?page=${page}&size=${DATA_LIMIT}&keyword=${encodeURIComponent(
          search
        )}&orderBy=${getSortKey(sort)}`
      );
      console.log("response", response);

      setArchives((preArchives) => {
        return page === 0
          ? response.archiveList
          : [...preArchives, ...response.archiveList];
      });

      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("기록 읽어오기 오류", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  /* 검색어 바뀔 시 */
  useEffect(() => {
    setArchives([]);
    console.log("기록 검색어 변경", search);
    getArchives(search, 0);
    setCurrentPage(0);
  }, [search]);

  /* 정렬 바뀔 시 */
  useEffect(() => {
    setCurrentPage(0);
    getArchives(search, 0);
  }, [sort]);

  /* 현재 페이지 변경 시 데이터 요청 */
  useEffect(() => {
    if (search && currentPage >= 0) {
      console.log(`페이지 ${currentPage} 데이터 로드`);
      getArchives(search, currentPage);
    }
  }, [currentPage]);

  /* 무한 스크롤 감지 */
  useEffect(() => {
    const handleObserver = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && currentPage < totalPages - 1 && !isLoading) {
        console.log("다음 페이지 로드!");
        setCurrentPage((prev) => prev + 1);
      }
    };

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [currentPage, totalPages, isLoading]);

  /* 정렬 클릭 */
  const handleClick = () => {
    setBottomSheetShow(true);
  };

  /* 정렬 변경 */
  const handleSortChange = (newSort) => {
    setSort(newSort);
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);
  };

  return (
    <>
      {isLoading ? ( // 로딩 중일 때 로딩 컴포넌트 표시
        <div className="flex justify-center items-center h-screen">
          <SuspenseLoading />
        </div>
      ) : (
        <div>
          <div className="flex justify-between px-4 pt-3">
            <div className="text-b2">
              {archives.length}
              <span className=" text-gray-500">개</span>
            </div>
            <button
              className="flex flex-row text-b2 text-gray-500"
              onClick={handleClick}
            >
              <div className="flex items-center">
                <span>{sort}</span>
                <img src={downArrow} alt="downArrow" />
              </div>
            </button>
          </div>
          <div className="px-4">
            {archives.length > 0 ? (
              archives.map((archive, index) => {
                if (archive.type === "REVIEW") {
                  return (
                    <ReviewComponent
                      key={index}
                      createdTime={archive.data.createdTime}
                      title={archive.data.reviewTitle}
                      content={archive.data.reviewContent}
                      bookTitle={archive.title}
                      bookAuthor={archive.author}
                    />
                  );
                } else {
                  return (
                    <ExcerptComponent
                      key={index}
                      createdTime={archive.data.createdTime}
                      visibility={archive.data.visibility}
                      content={archive.data.excerptContent}
                      bookTitle={archive.title}
                      bookAuthor={archive.author}
                    />
                  );
                }
              })
            ) : (
              <div className="flex flex-col items-center mt-[8.06rem]">
                <span className="text-st text-gray-800 font-semibold">
                  {search ? <span>'{search}'</span> : ""}
                </span>
                <span className="text-b1 text-gray-800">
                  일치하는 검색 결과가 없어요.
                </span>
              </div>
            )}
            <div ref={loaderRef} style={{ height: "1px" }} />
          </div>
        </div>
      )}
      <BottomSheetModal
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        setVisible={setVisible}
      >
        <div className="p-4">
          <ListBottomSheet
            options={sortingArr}
            currentOption={sort}
            handleOption={handleSortChange}
          />
        </div>
      </BottomSheetModal>
    </>
  );
};

export default SearchArchiveComponent;
