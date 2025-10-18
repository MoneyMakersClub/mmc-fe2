import { useNavigate, useLocation } from "react-router-dom";
import BookListView from "../common/BookListView";
import { getTotalBook } from "../../api/library";
import { useQuery } from "@tanstack/react-query";
import useBookInfoStore from "../../store/useBookInfoStore";
import bookEx from "../../assets/common/bookImg-ex.svg";

const Library = ({ onBookSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBookInfo } = useBookInfoStore();

  const {
    data: bookListData = { bookList: [] },
    isError,
    error,
  } = useQuery({
    queryKey: ["bookListData"],
    queryFn: () => getTotalBook("latest"),
  });

  const handleRecording = (book) => {
    if (onBookSelect) {
      onBookSelect(book);
    } else {
      setBookInfo(book);
      
      const searchParams = new URLSearchParams(location.search);
      const returnTo = searchParams.get('returnTo');
      const historyDelta = parseInt(searchParams.get('historyDelta') || '0') + 1;
      const url = returnTo 
        ? `/archive?recording=true&returnTo=${returnTo}&historyDelta=${historyDelta}`
        : '/archive?recording=true';
      
      navigate(url, { replace: true });
    }
  };
  return (
    <div className="flex flex-col mx-4">
      {bookListData &&
        bookListData.bookList.map((book) => (
          <BookListView
            edit={false}
            handleOnClick={() => handleRecording(book)}
            bookTitle={book.title}
            author={book.authors}
            bookImg={book.imgPath ? book.imgPath : bookEx}
            rating={book.rating}
          />
        ))}
    </div>
  );
};
export default Library;
