import React, { useState, useEffect } from "react";
import ReviewComponent from "./ReviewComponent";
import BottomSheetModal from "../common/modal/BottomSheetModal";
import ListBottomSheet from "../common/ListBottomSheet";
import downArrow from "../../assets/common/down-arrow.svg";
import { get } from "../../api/example";
import ExcerptComponent from "./ExcerptComponent";
import SuspenseLoading from "../common/SuspenseLoading";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

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
  const [sort, setSort] = useState("정확도순");
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["archives", search, getSortKey(sort)],
    queryFn: async ({ pageParam = 0 }) => {
      if (!search) return { archiveList: [], nextPage: 0, totalPages: 0 };
      const response = await get(
        `/archives/search?page=${pageParam}&size=${DATA_LIMIT}&keyword=${encodeURIComponent(
          search
        )}&orderBy=${getSortKey(sort)}`
      );
      console.log("response", response);
      return {
        archiveList: response.archiveList || [],
        nextPage: pageParam + 1,
        totalPages: response.totalPages || 1,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined,
    initialPageParam: 0,
    enabled: !!search,
  });

  // 무한 스크롤 훅 사용
  const { loaderRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });


  const archives = data?.pages.flatMap((page) => page.archiveList) || [];

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
