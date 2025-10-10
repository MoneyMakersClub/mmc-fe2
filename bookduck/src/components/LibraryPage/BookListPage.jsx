import { useEffect, useState } from "react";
import down from "../../assets/common/down.svg";
import RoundedTabComponent from "../common/RoundedTabComponent";
import BookListView from "../common/BookListView";
import BottomNavbar from "../common/BottomNavbar";
import BookComponent from "../SearchPage/BookComponent";
import cover_img_ex from "../../assets/libraryPage/cover-img-ex.svg";
import BottomSheetModal from "../common/BottomSheetModal";
import BottomSheetMenuComponent from "../common/BottomSheetMenuComponent";
import Divider1 from "../common/Divider1";
import Divider2 from "../common/Divider2";
import ListBottomSheet from "../common/ListBottomSheet";
import imgEx from "../../assets/common/bookImg-ex.svg";

import {
  deleteBook,
  getSortedTotalBook,
  getTotalBook,
  patchBookStatus,
} from "../../api/library";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getReadingStatusKey, statusArr } from "../../utils/bookStatus";

const BookListPage = ({ view }) => {
  const [sort, setSort] = useState("최신순");
  const [tabList, setTabList] = useState([]);
  const [sortingBottomSheet, setSortingBottomSheet] = useState(false); //최신순, 별점순, 제목순 보여주는 바텀시트 보이는지 여부
  const [visible, setVisible] = useState(false);
  const [statusBottomSheet, setStatusBottomSheet] = useState(false); //최신순, 별점순, 제목순 보여주는 바텀시트 보이는지 여부
  const [statusVisible, setStatusVisible] = useState(false);
  const [isCancel, setCancel] = useState(true);
  const [sortedBookList, setSortedBookList] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState();
  const [currentState, setCurrentState] = useState({});

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getSortKey = (sort) => {
    switch (sort) {
      case "최신순":
        return "latest";
      case "별점높은순":
        return "rating_high";
      case "별점낮은순":
        return "rating_low";
      case "제목순":
        return "title";
      default:
        return "latest";
    }
  };

  const { data: bookListData = { bookList: [] } } = useQuery({
    queryKey: ["bookListData", getSortKey(sort)],
    queryFn: () => getTotalBook(getSortKey(sort)),
  });
  useEffect(() => {
    if (bookListData) {
      const initialState = bookListData.bookList.reduce((acc, book) => {
        acc[book.userBookId] = book.readStatus;
        return acc;
      }, {});
      setCurrentState(initialState);
    }
  }, [bookListData]);

  useEffect(() => {
    if (bookListData) {
      const initialState = bookListData.bookList.reduce((acc, book) => {
        acc[book.userBookId] = book.readStatus;
        console.log(acc);
        return acc;
      }, {});
      setCurrentState(initialState);
    }
  }, [bookListData]);

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
      const statusList = tabList.map((it) => getReadingStatusKey(it));
      console.log(statusList);
      const res = await getSortedTotalBook(statusList, getSortKey(sort));
      setSortedBookList(res.bookList);
    };
    if (tabList.length !== 0) {
      selectSortedList();
    } else {
      setSortedBookList([]);
    }
  }, [tabList, sort]);

  const handleStatusClick = (userBookId) => {
    setSelectedBookId(userBookId);
    console.log(userBookId);
    setStatusBottomSheet(true);
  };

  const handleStatusChange = async (status) => {
    // 낙관적 업데이트: 즉시 UI 업데이트
    setCurrentState((prev) => ({
      ...prev,
      [selectedBookId]: getReadingStatusKey(status),
    }));

    setStatusVisible(false);
    setTimeout(() => {
      setStatusBottomSheet(false);
    }, 200);

    try {
      const res = await patchBookStatus(
        selectedBookId,
        getReadingStatusKey(status)
      );
      console.log(res);
      
      // React Query 캐시 무효화로 부드럽게 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["bookListData"] });
      
      // 필터가 적용된 경우 sortedBookList도 업데이트
      if (tabList.length !== 0) {
        const statusList = tabList.map((it) => getReadingStatusKey(it));
        const sortedRes = await getSortedTotalBook(statusList, getSortKey(sort));
        setSortedBookList(sortedRes.bookList);
      }
    } catch (error) {
      console.error("책 상태 변경 실패", error);
      // 실패 시 원래 상태로 롤백
      const initialState = bookListData.bookList.reduce((acc, book) => {
        acc[book.userBookId] = book.readStatus;
        return acc;
      }, {});
      setCurrentState(initialState);
    }
  };

  const handlePutCancel = async () => {
    setStatusVisible(false);
    setTimeout(() => {
      setStatusBottomSheet(false);
    }, 200);

    try {
      const res = await deleteBook(selectedBookId);
      console.log(res);
      
      // React Query 캐시 무효화로 부드럽게 데이터 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["bookListData"] });
      
      // 필터가 적용된 경우 sortedBookList도 업데이트
      if (tabList.length !== 0) {
        const statusList = tabList.map((it) => getReadingStatusKey(it));
        const sortedRes = await getSortedTotalBook(statusList, getSortKey(sort));
        setSortedBookList(sortedRes.bookList);
      }
    } catch (error) {
      console.error("책 삭제 실패", error);
    }
  };

  const handleBookClick = (isCustom, bookInfoId) => {
    if (isCustom === false) {
      navigate(`/info/book/${bookInfoId}`);
    } else {
      navigate(`/info/book/custom/${bookInfoId}`);
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-5 w-full p-4">
          <div
            onClick={handleSorting}
            className="flex items-center justify-center cursor-pointer"
          >
            <div className="text-b2 text-gray-500 whitespace-nowrap">
              {sort}
            </div>
            <img className="w-4 h-4" src={down} alt="down" />
          </div>
          <div className="overflow-x-auto">
            <RoundedTabComponent
              type="secondary"
              tabs={["읽고 싶어요", "읽고 있어요", "다 읽었어요", "중단했어요"]}
              activeTabs={tabList}
              onTabClick={handleTabClick}
              multiple={true}
            />
          </div>
        </div>
        {view === "list" && (
          <div className=" mx-4  ">
            {tabList.length === 0
              ? bookListData.bookList.map((book, index) => (
                  <BookListView
                    key={index}
                    handleStatusClick={() => handleStatusClick(book.userBookId)}
                    edit={true}
                    bottomSheet={true}
                    status={currentState[book.userBookId]}
                    bookTitle={book.title}
                    author={book.author}
                    bookImg={book.imgPath ? book.imgPath : imgEx}
                    rating={book.rating}
                    bookInfoId={book.bookInfoId}
                    handleOnClick={() =>
                      handleBookClick(book.isCustom, book.bookInfoId)
                    }
                  />
                ))
              : sortedBookList &&
                sortedBookList.map((book, index) => (
                  <BookListView
                    key={index}
                    handleStatusClick={() => handleStatusClick(book.userBookId)}
                    edit={true}
                    bottomSheet={true}
                    status={currentState[book.userBookId]}
                    bookTitle={book.title}
                    author={book.author}
                    bookImg={book.imgPath ? book.imgPath : imgEx}
                    rating={book.rating}
                    bookInfoId={book.bookInfoId}
                    handleOnClick={() =>
                      handleBookClick(book.isCustom, book.bookInfoId)
                    }
                  />
                ))}

            <div className="h-[6rem] bg-transparent"></div>
          </div>
        )}
        {view === "cover" && (
          <div className=" mx-4 overflow-y-auto">
            <div className="grid grid-cols-3 place-items-center gap-x-3 gap-y-5">
              {tabList.length === 0
                ? bookListData.bookList.map((book) => (
                    <BookComponent
                      img={book.imgPath ? book.imgPath : imgEx}
                      title={book.title}
                      rating={book.rating}
                    />
                  ))
                : sortedBookList &&
                  sortedBookList.map((book) => (
                    <BookComponent
                      img={book.imgPath ? book.imgPath : imgEx}
                      title={book.title}
                      rating={book.rating}
                    />
                  ))}
            </div>
            <div className="h-[6rem] bg-transparent"></div>
          </div>
        )}
      </div>
      {!sortingBottomSheet && !statusBottomSheet && <BottomNavbar />}
      {sortingBottomSheet && (
        <BottomSheetModal
          bottomSheetShow={sortingBottomSheet}
          setBottomSheetShow={setSortingBottomSheet}
          visible={visible}
          setVisible={setVisible}
        >
          <div className="pb-[1.88rem] px-4">
            <div
              onClick={() => handleSortChange("최신순")}
              className={`pt-1 pb-3 text-b2 ${
                sort === "최신순" ? "text-orange-400" : "text-gray-500"
              } cursor-pointer`}
            >
              최신순
            </div>
            <Divider2 />
            <div
              onClick={() => handleSortChange("별점높은순")}
              className={`h-12 py-3 text-b2 ${
                sort === "별점높은순" ? "text-orange-400" : "text-gray-500"
              } cursor-pointer`}
            >
              별점높은순
            </div>
            <Divider2 />
            <div
              onClick={() => handleSortChange("별점낮은순")}
              className={`h-12 py-3 text-b2 ${
                sort === "별점낮은순" ? "text-orange-400" : "text-gray-500"
              } cursor-pointer`}
            >
              별점낮은순
            </div>
            <Divider2 />

            <div
              onClick={() => handleSortChange("제목순")}
              className={`h-12 py-3 text-b2 ${
                sort === "제목순" ? "text-orange-400" : "text-gray-500"
              } cursor-pointer`}
            >
              제목순
            </div>
          </div>
        </BottomSheetModal>
      )}
      {statusBottomSheet && (
        <BottomSheetModal
          bottomSheetShow={statusBottomSheet}
          setBottomSheetShow={setStatusBottomSheet}
          visible={statusVisible}
          setVisible={setStatusVisible}
        >
          <div className="px-4">
            <ListBottomSheet
              title="책 상태"
              options={statusArr}
              currentOption={currentState}
              handleOption={handleStatusChange}
              isCancel={isCancel}
              handlePutCancel={handlePutCancel}
            />
          </div>
        </BottomSheetModal>
      )}
    </>
  );
};
export default BookListPage;
