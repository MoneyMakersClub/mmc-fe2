import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookListView from "../common/BookListView";
import ButtonComponent from "../common/ButtonComponent";
import BottomSheetModal from "../common/modal/BottomSheetModal";
import Divider1 from "../../components/common/Divider1";
import BookStatusModal from "../common/BookStatusModal";
import SuspenseLoading from "../common/SuspenseLoading";
import { get, patch, post, del } from "../../api/example";
import { getReadingStatusKor, getReadingStatusKey, statusArr } from "../../utils/bookStatus";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const DATA_LIMIT = 10;

const SearchBookComponent = ({ search, selectBook = false, onClick }) => {
  const navigate = useNavigate();
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoadingRegistered, setIsLoadingRegistered] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [registeredBooks, setRegisteredBooks] = useState([]);
  const [currentState, setCurrentState] = useState(null);

  // API - 등록 책 정보 받아오기
  const getRegisteredBooks = async (keyword) => {
    if (!keyword) return;
    try {
      setIsLoadingRegistered(true);
      const response = await get(
        `/bookinfo/search/custom?keyword=${encodeURIComponent(keyword)}`
      );
      setRegisteredBooks(response.bookList || []);
    } catch (error) {
      console.error("등록 책 읽어오기 오류:", error);
    } finally {
      setIsLoadingRegistered(false);
    }
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["searchBooks", search],
    queryFn: async ({ pageParam = 0 }) => {
      if (!search) return { bookList: [], nextPage: 0, totalPages: 0 };
      const response = await get(
        `/bookinfo/search?keyword=${encodeURIComponent(
          search
        )}&page=${pageParam}&size=${DATA_LIMIT}`
      );
      return {
        bookList: response.bookList || [],
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

  // 모든 페이지의 책 데이터 병합
  const books = data?.pages.flatMap((page) => page.bookList) || [];

  // 책 상태 변경 API 호출
  const patchRegisteredStatus = async (option) => {
    try {
      const statusKey = getReadingStatusKey(option);
      await patch(`/books/${selectedBook.userbookId}?status=${statusKey}`);
      console.log(`책 상태 업데이트 성공: ${statusKey}`);
      setSelectedBook(null);
      getRegisteredBooks(search); // 등록된 책 갱신
      refetch(); // 일반 책 갱신
      setVisible(false);
      setTimeout(() => {
        setBottomSheetShow(false);
      }, 200);
    } catch (error) {
      console.error("책 상태 변경 업데이트 오류:", error);
    }
  };

  // 책 등록 API 호출
  const postBooks = async (option) => {
    const statusKey = getReadingStatusKey(option);
    try {
      const requestBody = {
        title: selectedBook.title,
        author: selectedBook.author,
        imgPath: selectedBook.imgPath,
        readStatus: statusKey,
      };
      await post(`/bookinfo/${selectedBook.providerId}/add`, requestBody);
      console.log(`서재에 도서 추가 완료: ${selectedBook.providerId}`);
      setVisible(false);
      setTimeout(() => {
        setBottomSheetShow(false);
      }, 200);
      setSelectedBook(null);
      refetch(); // 책 목록 갱신
    } catch (error) {
      console.error("책 등록 업데이트 오류:", error);
    }
  };

  // 책 삭제 API 호출
  const deleteBook = async (userbookId) => {
    try {
      await del(`/books/${userbookId}`);
      setSelectedBook(null);
      getRegisteredBooks(search);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookClick = (bookInfoId, providerId) => {
    console.log(bookInfoId, providerId);
    
    if (bookInfoId === null) {
      navigate(`/info/book/external/${providerId}`);
    } else {
      navigate(`/info/book/${bookInfoId}`);
    }
  };

  const handleCustomBookClick = (bookInfoId) => {
    navigate(`/info/book/custom/${bookInfoId}`);
  };

  const handleStatusChange = (option) => {
    if (!selectedBook) return;

    if (selectedBook.providerId) {
      // 일반 책인 경우
      if (selectedBook.readStatus === null) {
        // 미등록 책
        postBooks(option);
      } else {
        // 등록된 책
        patchRegisteredStatus(option);
      }
    } else {
      // 등록된 책만 처리
      patchRegisteredStatus(option);
    }
    setCurrentState(option);
  };

  // 책 선택 핸들러
  const handleSelectedBook = (book, isRegistered) => {
    console.log("북덕", book);
    const isLibraryBook = !isRegistered && book.bookUnitDto?.userbookId;
    setSelectedBook({
      bookInfoId: isRegistered
        ? book.bookInfoId
        : isLibraryBook
        ? book.bookUnitDto.bookInfoId
        : null,
      userbookId: isRegistered
        ? book.userbookId
        : isLibraryBook
        ? book.bookUnitDto.userbookId
        : null,
      providerId: isRegistered ? null : book.providerId,
      title: isRegistered ? book.title : book.bookUnitDto.title,
      author: isRegistered ? book.author : book.bookUnitDto.author,
      imgPath: isRegistered ? book.imgPath : book.bookUnitDto.imgPath,
      readStatus: isRegistered ? book.readStatus : book.bookUnitDto.readStatus,
    });
    const status = isRegistered ? book.readStatus : book.bookUnitDto.readStatus;
    setCurrentState(getReadingStatusKor(status));

    setBottomSheetShow(true);
  };

  useEffect(() => {
    if (search) {
      console.log("검색어 변경:", search);
      getRegisteredBooks(search); // 등록된 책 요청
    }
  }, [search]);

  return (
    <>
      {isLoading ? ( // 로딩 중일 때 로딩바 표시
        <div className="flex justify-center items-center h-screen">
          <SuspenseLoading />
        </div>
      ) : registeredBooks.length > 0 || books.length > 0 ? (
        <div>
          <div>
            {registeredBooks.map((book, index) => (
              <BookListView
                key={index}
                bookTitle={book.title}
                author={book.author}
                bookImg={book.imgPath}
                status={book.readStatus}
                rating={book.myRating}
                register={true}
                edit={true}
                bottomSheet={true}
                handleStatusClick={() => handleSelectedBook(book, true)}
                handleOnClick={() => {
                  if (selectBook) {
                    onClick(book);
                  } else {
                    handleCustomBookClick(book.bookUnitDto.bookInfoId);
                  }
                }}
                isSearch={true}
              />
            ))}
          </div>
          {registeredBooks.length > 0 && books.length > 0 && <Divider1 />}
          <div>
            {books.map((book, index) => (
              <BookListView
                key={index}
                bookTitle={book.bookUnitDto.title}
                author={book.bookUnitDto.author}
                bookImg={book.bookUnitDto.imgPath}
                rating={book.bookUnitDto.myRating}
                status={book.bookUnitDto.readStatus || "ADD_TO_LIBRARY"}
                edit={true}
                bottomSheet={true}
                handleStatusClick={() => handleSelectedBook(book, false)}
                isSearch={true}
                handleOnClick={() => {
                  if (selectBook) {
                    onClick(book);
                  } else {
                    handleBookClick(
                      book.bookUnitDto.bookInfoId,
                      book.providerId
                    );
                  }
                }}
              />
            ))}
            <div ref={loaderRef} style={{ height: "1px" }} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center mt-[8.06rem]">
          <span className="text-st text-gray-800 font-semibold">
            {search ? <span>'{search}'</span> : ""}
          </span>
          <span className="text-b1 text-gray-800">
            일치하는 검색 결과가 없어요.
          </span>
          <span className="text-b1 text-gray-500 mb-3">
            책을 직접 등록해보세요!
          </span>
          <ButtonComponent
            text="책 등록하기"
            type="secondary"
            color="orange"
            size="small"
            onClick={() => navigate("/search/register")}
          />
        </div>
      )}
      <BottomSheetModal
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        setVisible={setVisible}
      >
        <BookStatusModal
          currentStatus={selectedBook?.readStatus}
          onStatusChange={handleStatusChange}
          onDelete={() => deleteBook(selectedBook.userbookId)}
          showDelete={!!selectedBook?.userbookId}
        />
      </BottomSheetModal>
    </>
  );
};

export default SearchBookComponent;
