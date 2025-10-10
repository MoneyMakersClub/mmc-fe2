import React, { useState } from "react";
import { get } from "../../api/example";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SearchComponent from "../../components/common/SearchComponent";
import BookComponent from "../../components/SearchPage/BookComponent";
import ButtonComponent from "../../components/common/ButtonComponent";
import CarouselComponent from "../../components/SearchPage/CarouselComponent";
import SearchBookComponent from "../../components/SearchPage/SearchBookComponent";
import SearchArchiveComponent from "../../components/SearchPage/SearchArchiveComponent";
import SearchUserComponent from "../../components/SearchPage/SearchUserComponent";
import BottomNavbar from "../../components/common/BottomNavbar";
import TabBarComponent from "../../components/common/TabBarComponent";

const SearchMainPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [tab, setTab] = useState("도서");
  //API 연결
  //최근 책 받기
  const getRecentBooks = async () => {
    const response = await get(`/books/recent`);
    console.log("최근 책", response);
    return response;
  };

  //많이 읽는 책 받기
  const getPopularBooks = async () => {
    const response = await get(`/bookinfo/most`);
    console.log("많이 읽는 책", response);
    return response;
  };

  //이벤트 핸들러
  const handleSearch = () => {
    setSubmittedSearch(search);
  };

  const recentBooksQuery = useQuery({
    queryKey: ["recentBooks"],
    queryFn: getRecentBooks,
    onSuccess: () => {
      console.log("최근 책 받기 성공");
    },
    onError: (error) => console.error("최근 책 받기 실패", error),
  });
  const recentBooks = recentBooksQuery.data.bookList;

  const popularBooksQuery = useQuery({
    queryKey: ["popularBooks"],
    queryFn: getPopularBooks,
    onSuccess: () => {
      console.log("많이 읽는 책 받기 성공");
    },
    onError: (error) => console.error("많이 읽는 책 받기 실패", error),
  });
  const popularBooks = popularBooksQuery.data.bookList;

  return (
    <div className="w-full">
      <div className="w-full">
        <SearchComponent
          search={search}
          setSearch={setSearch}
          onEnter={handleSearch}
        />
        {!search ? (
          <>
            <div className="w-full flex flex-col gap-3 mt-4 margin-auto px-4">
              <div className="text-b1 font-semibold text-gray-800">
                최근 기록한 책
              </div>
              {recentBooks.length > 0 ? (
                <CarouselComponent books={recentBooks} />
              ) : (
                <div className="flex w-full h-[11.5rem] justify-center items-center">
                  <p className="text-gray-400 text-b2">
                    아직 기록한 책이 없어요.
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center h-24 px-8 py-4 bg-gray-10 my-5">
              <div className="flex flex-col gap-1 justify-center">
                <span className="text-c1 text-gray-400">
                  책을 찾을 수 없나요?
                </span>
                <span className="text-btn3 text-gray-800">
                  원하는 책을 직접 등록해보세요
                </span>
              </div>
              <ButtonComponent
                text="책 등록하기"
                type="secondary"
                color="orange"
                size="medium"
                onClick={() => navigate("/search/register")}
                className="h-10"
              />
            </div>
            <div className="flex flex-col gap-3 px-4">
              <div className="text-b1 font-semibold text-gray-800">
                요즘 많이 읽는 책 Top 12
              </div>
              <CarouselComponent books={popularBooks} />
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <TabBarComponent
              tabs={["도서", "기록", "사용자"]}
              activeTab={tab}
              onTabClick={setTab}
              size="small"
              borderWidth="3rem"
            />
            {tab === "도서" && (
              <SearchBookComponent
                search={submittedSearch}
                setSearch={setSearch}
              />
            )}
            {tab === "기록" && (
              <SearchArchiveComponent
                search={submittedSearch}
                setSearch={setSearch}
              />
            )}
            {tab === "사용자" && (
              <SearchUserComponent
                search={submittedSearch}
                setSearch={setSearch}
              />
            )}
          </div>
        )}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default SearchMainPage;
