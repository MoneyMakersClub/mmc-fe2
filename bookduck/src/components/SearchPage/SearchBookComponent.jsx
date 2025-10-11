import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BookListView from "../common/BookListView";
import ButtonComponent from "../common/ButtonComponent";
import BottomSheetModal from "../common/BottomSheetModal";
import Divider1 from "../../components/common/Divider1";
import ListBottomSheet from "../common/ListBottomSheet";
import SuspenseLoading from "../common/SuspenseLoading";
import { get, patch, post, del } from "../../api/example";
import { getReadingStatusKor, getReadingStatusKey, statusArr } from "../../utils/bookStatus";

const DATA_LIMIT = 10;

const SearchBookComponent = ({ search, selectBook = false, onClick }) => {
  const navigate = useNavigate();
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [registeredBooks, setRegisteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [currentState, setCurrentState] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const loaderRef = useRef(null);

  // API - 등록 책 정보 받아오기
  const getRegisteredBooks = async (keyword) => {
    if (!keyword) return;
    try {
      setIsLoading(true); // 로딩 시작
      const response = await get(
        `/bookinfo/search/custom?keyword=${encodeURIComponent(keyword)}`
      );
      setRegisteredBooks(response.bookList || []);
    } catch (error) {
      console.error("등록 책 읽어오기 오류:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // API - 일반 책 데이터 받아오기
  const getBooks = async (keyword, page = 0) => {
    if (!keyword) return setBooks([]);
    try {
      setIsLoading(true); // 로딩 시작
      const response = await get(
        `/bookinfo/search?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&size=${DATA_LIMIT}`
      );
      setBooks((prevBooks) => {
        return page === 0
          ? response.bookList
          : [...prevBooks, ...response.bookList];
      });
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("책 데이터 불러오기 오류:", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 책 상태 변경 API 호출
  const patchRegisteredStatus = async (option) => {
    try {
      const statusKey = getReadingStatusKey(option);
      await patch(`/books/${selectedBook.userbookId}?status=${statusKey}`);
      console.log(`책 상태 업데이트 성공: ${statusKey}`);
      setSelectedBook(null);
      getRegisteredBooks(search); // 등록된 책 갱신
      getBooks(search, 0); // 일반 책 첫 페이지 갱신
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
      getBooks(search, 0); // 첫 페이지 새로 로드
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
      getBooks(search, 0);
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
    // 검색어가 변경될 때 상태를 초기화하고 첫 페이지 호출
    const resetSearch = async () => {
      console.log("검색어 변경:", search);

      // 상태 초기화
      setBooks([]); // 기존 책 데이터 초기화
      setCurrentPage(0); // 페이지 초기화
      setTotalPages(1);

      try {
        await getRegisteredBooks(search); // 등록된 책 요청
        await getBooks(search, 0); // 첫 페이지 요청
      } catch (error) {
        console.error("검색어 변경 처리 중 오류:", error);
      }
    };

    if (search) {
      resetSearch(); // 검색어 변경 시 초기화 함수 호출
    }
  }, [search]);

  // 무한 스크롤 감지
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
  }, [currentPage, totalPages]);

  // 현재 페이지 변경 시 데이터 요청
  useEffect(() => {
    if (search && currentPage >= 0) {
      console.log(`페이지 ${currentPage} 데이터 로드`);
      getBooks(search, currentPage);
    }
  }, [currentPage, search]);

  return (
    <>
      {isLoading ? ( // 로딩 중일 때 로딩바 표시
        <div className="flex justify-center items-center h-screen">
          <SuspenseLoading />
        </div>
      ) : registeredBooks.length > 0 || books.length > 0 ? (
        <>
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
        </>
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
        <div className="p-4">
          <ListBottomSheet
            title="책 상태"
            options={statusArr}
            currentOption={currentState}
            handleOption={handleStatusChange}
            handlePutCancel={deleteBook}
          />
        </div>
      </BottomSheetModal>
    </>
  );
};

export default SearchBookComponent;
