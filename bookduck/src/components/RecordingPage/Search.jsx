import { useState } from "react";
import BookListView from "../common/BookListView";
import SearchComponent from "../common/SearchComponent";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../api/example";
import SearchBookComponent from "../SearchPage/SearchBookComponent";
import useBookInfoStore from "../../store/useBookInfoStore";

const Search = ({ onBookSelect }) => {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { setBookInfo } = useBookInfoStore();
  const navigate = useNavigate();

  const getRecentBooks = async () => {
    return await get(`/books/recent`);
  };

  //많이 읽는 책 받기
  const getPopularBooks = async () => {
    return await get(`/bookinfo/most`);
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

  const handleRecording = (bookInfo) => {
    console.log(bookInfo);
    if (onBookSelect) {
      onBookSelect(bookInfo);
    } else {
      setBookInfo(bookInfo);
      navigate("/recording");
    }
  };

  return (
    <>
      <div className="px-4">
        <SearchComponent
          search={search}
          setSearch={setSearch}
          onEnter={handleSearch}
        />
      </div>
      <div className="flex flex-col mx-4 mt-[0.5rem]">
        {search && (
          <SearchBookComponent
            selectBook={true}
            search={submittedSearch}
            setSearch={setSearch}
            onClick={handleRecording}
          />
        )}
      </div>
    </>
  );
};
export default Search;
