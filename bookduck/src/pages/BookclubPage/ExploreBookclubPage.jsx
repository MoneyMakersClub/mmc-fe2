import { useEffect, useState } from "react";
import down from "../../assets/common/down.svg";
import SortFilterBar from "../../components/common/SortFilterBar";
import BookclubListView from "../../components/common/BookclubListView";
import BookclubCardView from "../../components/common/BookclubCardView";
import BottomSheetModal from "../../components/common/modal/BottomSheetModal";
import BottomSheetMenuComponent from "../../components/common/BottomSheetMenuComponent";
import Divider1 from "../../components/common/Divider1";
import Divider2 from "../../components/common/Divider2";
import ListBottomSheet from "../../components/common/ListBottomSheet";
import BookclubComponent from "../../components/SearchPage/BookclubComponent";
import SearchComponent from "../../components/common/SearchComponent";
import SuspenseLoading from "../../components/common/SuspenseLoading";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

import {
  getNewClubs,
} from "../../api/bookclub";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const ExploreBookclubPage = ({ view = "list" }) => {
  const [sort, setSort] = useState("최신순");
  const [tabList, setTabList] = useState([]);
  const [sortingBottomSheet, setSortingBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [statusBottomSheet, setStatusBottomSheet] = useState(false);
  const [statusVisible, setStatusVisible] = useState(false);
  const [isCancel, setCancel] = useState(true);
  const [sortedClubList, setSortedClubList] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState();
  const [currentState, setCurrentState] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // 북클럽 상태 필터
  const statusArr = ["시작 전", "읽는 중", "종료"];

  const getSortKey = (sort) => {
    switch (sort) {
      case "최신순":
        return "latest";
      case "인기순":
        return "popular";
      default:
        return "latest";
    }
  };

  const getStatusKey = (status) => {
    switch (status) {
      case "시작 전":
        return "BEFORE_START";
      case "읽는 중":
        return "IN_PROGRESS";
      case "종료":
        return "FINISHED";
      default:
        return null;
    }
  };

  // 최신 북클럽 둘러보기
  const {
    data,
    isLoading: isLoadingNew,
    error: errorNew,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["newClubsData", getSortKey(sort)],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await getNewClubs(pageParam, 20, getSortKey(sort));
      return {
        clubs: response.clubs?.pageContent || [],
        nextPage: pageParam + 1,
        totalPages: response.clubs?.totalPages || 0,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined,
    initialPageParam: 0,
    retry: false,
  });

  // 무한 스크롤 훅 사용
  const { loaderRef } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });


  const allClubs = data?.pages.flatMap((page) => page.clubs) || [];
  const clubListData = { clubs: allClubs };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    setVisible(false);
    setTimeout(() => {
      setSortingBottomSheet(false);
    }, 200);
  };

  const handleSorting = () => {
    setSortingBottomSheet(true);
  };

  const handleTabClick = async (tab) => {
    setTabList((prev) =>
      prev.includes(tab) ? [] : [tab]
    );
    console.log(tabList);
  };

  const filteredClubs = []; // 빈 배열로 설정

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setIsSearching(true);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim() === "") {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 검색바 */}
      <SearchComponent
        placeholder="북클럽을 검색해보세요"
        search={searchQuery}
        setSearch={handleSearchChange}
        onEnter={handleSearch}
        custom={true}
      />

      <SortFilterBar
        sort={sort}
        onSortClick={handleSorting}
        tabs={[]}
        activeTabs={[]}
        onTabClick={() => {}}
        multiple={false}
      />
      
      {isLoadingNew && (
        <div className="flex justify-center items-center py-10">
          <SuspenseLoading />
        </div>
      )}

      {errorNew && (
        <div className="flex justify-center items-center py-10">
          <div className="text-red-500">데이터를 불러오는데 실패했습니다.</div>
        </div>
      )}

      {!isLoadingNew && !errorNew && view === "list" && (
        <div className="mx-4">
          {(clubListData?.clubs || []).length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">
                {isSearching ? "검색된 북클럽이 없습니다." : "북클럽이 없습니다."}
              </div>
            </div>
          ) : (
            <>
              {tabList.length === 0
                ? (clubListData?.clubs || []).map((club, index) => (
                    <BookclubListView key={index} clubs={[club]} type="explore" />
                  ))
                : sortedClubList &&
                  sortedClubList.map((club, index) => (
                    <BookclubListView key={index} clubs={[club]} type="explore" />
                  ))}
            </>
          )}
        </div>
      )}
      {!isLoadingNew && !errorNew && view === "cover" && (
        <div className="mx-4">
          {(clubListData?.clubs || []).length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">
                {isSearching ? "검색된 북클럽이 없습니다." : "북클럽이 없습니다."}
              </div>
            </div>
          ) : (
            <>
              {tabList.length === 0
                ? (clubListData?.clubs || []).map((club, index) => (
                    <BookclubListView key={index} clubs={[club]} type="explore" />
                  ))
                : sortedClubList &&
                  sortedClubList.map((club, index) => (
                    <BookclubListView key={index} clubs={[club]} type="explore" />
                  ))}
              
              {/* 무한 스크롤 로더 */}
              {!isSearching && tabList.length === 0 && (
                <div ref={loaderRef} className="flex justify-center items-center py-4">
                  {isFetchingNextPage && <div className="text-gray-500">로딩 중...</div>}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 정렬 바텀시트 */}
      <BottomSheetModal
        bottomSheetShow={sortingBottomSheet}
        setBottomSheetShow={setSortingBottomSheet}
        visible={visible}
        setVisible={setVisible}
      >
        <ListBottomSheet
          title="정렬"
          items={["최신순", "인기순"]}
          currentItem={sort}
          onItemSelect={handleSortChange}
          onCancel={() => {
            setVisible(false);
            setTimeout(() => {
              setSortingBottomSheet(false);
            }, 200);
          }}
        />
      </BottomSheetModal>

    </div>
  );
};

export default ExploreBookclubPage;

