import { useEffect, useState } from "react";
import down from "../../assets/common/down.svg";
import SortFilterBar from "../common/SortFilterBar";
import BookclubListView from "../common/BookclubListView";
import BookclubCardView from "../common/BookclubCardView";
import BottomSheetModal from "../common/BottomSheetModal";
import BottomSheetMenuComponent from "../common/BottomSheetMenuComponent";
import Divider1 from "../common/Divider1";
import Divider2 from "../common/Divider2";
import ListBottomSheet from "../common/ListBottomSheet";
import BookclubComponent from "../SearchPage/BookclubComponent";
import SearchComponent from "../common/SearchComponent";

import {
  searchClubs,
  getSortedClubs,
} from "../../api/bookclub";
import { useQuery } from "@tanstack/react-query";
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

  const navigate = useNavigate();

  // 북클럽 상태 필터
  const statusArr = ["시작 전", "읽는 중", "종료"];

  const getSortKey = (sort) => {
    switch (sort) {
      case "최신순":
        return "latest";
      case "이름순":
        return "name";
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

  // 북클럽 검색 (임시로 비활성화)
  // const { data: clubListData = { clubs: [] } } = useQuery({
  //   queryKey: ["clubSearchData", searchQuery, getSortKey(sort)],
  //   queryFn: () => searchClubs({ query: searchQuery, sort: getSortKey(sort) }),
  // });

  // useEffect(() => {
  //   if (clubListData?.clubs) {
  //     const initialState = clubListData.clubs.reduce((acc, club) => {
  //       acc[club.clubId] = club.status;
  //       return acc;
  //     }, {});
  //     setCurrentState(initialState);
  //   }
  // }, [clubListData]);

  // 임시 데이터
  const clubListData = { clubs: [] };

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

  useEffect(() => {
    const selectSortedList = async () => {
      const statusList = tabList.map((it) => getStatusKey(it));
      console.log(statusList);
      const res = await getSortedClubs(statusList, getSortKey(sort));
      setSortedClubList(res.clubList);
    };
    if (tabList.length !== 0) {
      selectSortedList();
    } else {
      setSortedClubList([]);
    }
  }, [tabList, sort]);

  const filteredClubs = sortedClubList.length > 0 ? sortedClubList : clubListData?.clubs || [];

  const handleSearch = () => {
    // 검색 실행 
  };

  return (
    <div className="flex flex-col">
      {/* 검색바 */}
      <SearchComponent
        placeholder="북클럽을 검색해보세요"
        search={searchQuery}
        setSearch={setSearchQuery}
        onEnter={handleSearch}
        custom={true}
      />

      <SortFilterBar
        sort={sort}
        onSortClick={handleSorting}
        tabs={["시작 전", "읽는 중", "종료"]}
        activeTabs={tabList}
        onTabClick={handleTabClick}
        multiple={true}
      />
      {view === "list" && (
        <div className="mx-4">
          {(clubListData?.clubs || []).length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">검색된 북클럽이 없습니다.</div>
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
      {view === "cover" && (
        <div className="mx-4">
          {(clubListData?.clubs || []).length === 0 ? (
            <div className="flex justify-center items-center py-10">
              <div className="text-gray-500">검색된 북클럽이 없습니다.</div>
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

      {/* 정렬 바텀시트 */}
      <BottomSheetModal
        bottomSheetShow={sortingBottomSheet}
        setBottomSheetShow={setSortingBottomSheet}
        visible={visible}
        setVisible={setVisible}
      >
        <ListBottomSheet
          title="정렬"
          items={["최신순", "이름순"]}
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

      {/* 상태 필터 바텀시트 */}
      <BottomSheetModal
        bottomSheetShow={statusBottomSheet}
        setBottomSheetShow={setStatusBottomSheet}
        visible={statusVisible}
        setVisible={setStatusVisible}
      >
        <ListBottomSheet
          title="상태"
          items={statusArr}
          currentItem={tabList[0] || "전체"}
          onItemSelect={handleTabClick}
          onCancel={() => {
            setStatusVisible(false);
            setTimeout(() => {
              setStatusBottomSheet(false);
            }, 200);
          }}
        />
      </BottomSheetModal>
    </div>
  );
};

export default ExploreBookclubPage;
