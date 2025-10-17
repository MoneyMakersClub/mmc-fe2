import { useEffect, useState, useMemo } from "react";
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
  searchClubs,
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
  const [selectedClubId, setSelectedClubId] = useState();
  const [currentState, setCurrentState] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(null); 
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  // 북클럽 상태 필터
  const statusArr = ["전체", "읽는 중", "종료"];

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
      case "전체":
        return null;
      case "읽는 중":
        return "ACTIVE";
      case "종료":
        return "ENDED";
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

  // 북클럽 검색 쿼리
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: errorSearch,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = useInfiniteQuery({
    queryKey: ["searchClubs", submittedSearch, tabList],
    queryFn: async ({ pageParam = 0 }) => {
      const selectedStatus = tabList.length > 0 ? getStatusKey(tabList[0]) : null;
      
      const response = await searchClubs({
        keyword: submittedSearch,
        clubStatus: selectedStatus,
        page: pageParam,
        size: 20
      });
      
      return {
        clubs: response.clubs?.pageContent || [],
        nextPage: pageParam + 1,
        totalPages: response.clubs?.totalPages || 0,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextPage < lastPage.totalPages ? lastPage.nextPage : undefined,
    initialPageParam: 0,
    enabled: !!submittedSearch,
  });

  // 검색 결과 무한 스크롤 훅
  const { loaderRef: searchLoaderRef } = useInfiniteScroll({
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  });

  const allClubs = data?.pages.flatMap((page) => page.clubs) || [];
  const searchResults = searchData?.pages.flatMap((page) => page.clubs) || [];
  const clubListData = { clubs: isSearching ? searchResults : allClubs };

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
    setTabList((prev) => {
      const newList = prev.includes(tab) ? [] : [tab];
      return newList;
    });
  };


  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      setSubmittedSearch(searchQuery);
      setIsSearching(true);
      // 검색 시 "전체" 필터 기본 적용
      setTabList(["전체"]);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim() === "") {
      setIsSearching(false);
      setSubmittedSearch(null);
      // 검색어 지울 때 필터도 초기화
      setTabList([]);
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
        tabs={isSearching ? statusArr : []}
        activeTab={tabList.length > 0 ? tabList[0] : null}
        activeTabs={tabList}
        onTabClick={handleTabClick}
        multiple={false}
      />
      
      {(isLoadingNew || (isSearching && isLoadingSearch)) && (
        <div className="flex justify-center items-center py-10">
          <SuspenseLoading />
        </div>
      )}

      {(errorNew || (isSearching && errorSearch)) && (
        <div className="flex justify-center items-center py-10">
          <div className="text-red-500">
            {isSearching ? "검색 중 오류가 발생했습니다." : "데이터를 불러오는데 실패했습니다."}
          </div>
        </div>
      )}

      {!isLoadingNew && !errorNew && !(isSearching && isLoadingSearch) && !(isSearching && errorSearch) && view === "list" && (
        <div className="mx-4">
          {(clubListData?.clubs || []).length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">
                {isSearching ? "검색된 북클럽이 없습니다." : "북클럽이 없습니다."}
              </div>
            </div>
          ) : (
            <>
              {(clubListData?.clubs || []).map((club, index) => (
                <BookclubListView key={index} clubs={[club]} type="explore" />
              ))}
            </>
          )}
        </div>
      )}
      {!isLoadingNew && !errorNew && !(isSearching && isLoadingSearch) && !(isSearching && errorSearch) && view === "cover" && (
        <div className="mx-4">
          {(clubListData?.clubs || []).length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">
                {isSearching ? "검색된 북클럽이 없습니다." : "북클럽이 없습니다."}
              </div>
            </div>
          ) : (
            <>
              {(clubListData?.clubs || []).map((club, index) => (
                <BookclubListView key={index} clubs={[club]} type="explore" />
              ))}
              
              {/* 무한 스크롤 로더 */}
              <div ref={isSearching ? searchLoaderRef : loaderRef} className="flex justify-center items-center py-4">
                {(isFetchingNextPage || isFetchingNextSearchPage) && <div className="text-gray-500">로딩 중...</div>}
              </div>
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

