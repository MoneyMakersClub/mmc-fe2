import { useEffect, useState } from "react";
import NavigationHeader from "../../components/common/NavigationHeader";
import SortFilterBar from "../../components/common/SortFilterBar";
import BookListView from "../../components/common/BookListView";
import BookComponent from "../../components/SearchPage/BookComponent";
import BottomSheetModal from "../../components/common/modal/BottomSheetModal";
import Divider2 from "../../components/common/Divider2";
import ListBottomSheet from "../../components/common/ListBottomSheet";
import imgEx from "../../assets/common/bookImg-ex.svg";
import useBookInfoStore from "../../store/useBookInfoStore";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getReadingStatusKey, statusArr } from "../../utils/bookStatus";
import { getTotalBook, getSortedTotalBook } from "../../api/library";

const SelectBookForClubPage = () => {
  const [sort, setSort] = useState("최신순");
  const [tabList, setTabList] = useState([]);
  const [sortingBottomSheet, setSortingBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sortedBookList, setSortedBookList] = useState([]);
  const [currentState, setCurrentState] = useState({});

  const { setSelectedBookInfo } = useBookInfoStore();
  const navigate = useNavigate();

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
    if (bookListData?.bookList) {
      const initialState = bookListData.bookList.reduce((acc, book) => {
        acc[book.userBookId] = book.readStatus;
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
  };

  useEffect(() => {
    const selectSortedList = async () => {
      const statusList = tabList.map((it) => getReadingStatusKey(it));
      const res = await getSortedTotalBook(statusList, getSortKey(sort));
      setSortedBookList(res.bookList);
    };
    if (tabList.length !== 0) {
      selectSortedList();
    } else {
      setSortedBookList([]);
    }
  }, [tabList, sort]);

  const handleBookSelect = (bookInfo) => {
    setSelectedBookInfo(bookInfo);
    navigate("/bookclub/create", { replace: true });
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
      <div className="">
        <NavigationHeader title="서재에서 책 선택" />
        <div className="pt-[calc(env(safe-area-inset-top)+2.75rem)]">
          <div className="flex flex-col">
            <SortFilterBar
              sort={sort}
              onSortClick={handleSorting}
              tabs={["읽고 싶어요", "읽고 있어요", "다 읽었어요", "중단했어요"]}
              activeTabs={tabList}
              onTabClick={handleTabClick}
              multiple={true}
            />
            
            <div className="mx-4">
              {tabList.length === 0
                ? bookListData.bookList.map((book, index) => (
                    <BookListView
                      key={index}
                      edit={false}
                      bottomSheet={false}
                      status={currentState[book.userBookId]}
                      bookTitle={book.title}
                      author={book.author}
                      bookImg={book.imgPath ? book.imgPath : imgEx}
                      rating={book.rating}
                      bookInfoId={book.bookInfoId}
                      handleOnClick={() =>
                        handleBookClick(book.isCustom, book.bookInfoId)
                      }
                      onBookSelect={() => handleBookSelect(book)}
                    />
                  ))
                : sortedBookList &&
                  sortedBookList.map((book, index) => (
                    <BookListView
                      key={index}
                      edit={false}
                      bottomSheet={false}
                      status={currentState[book.userBookId]}
                      bookTitle={book.title}
                      author={book.author}
                      bookImg={book.imgPath ? book.imgPath : imgEx}
                      rating={book.rating}
                      bookInfoId={book.bookInfoId}
                      handleOnClick={() =>
                        handleBookClick(book.isCustom, book.bookInfoId)
                      }
                      onBookSelect={() => handleBookSelect(book)}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default SelectBookForClubPage;
