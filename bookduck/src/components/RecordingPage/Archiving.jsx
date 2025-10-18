import { useNavigate, useLocation } from "react-router-dom";
import BookListView from "../common/BookListView";
import { useQuery } from "@tanstack/react-query";
import { getSortedTotalBook } from "../../api/library";
import useBookInfoStore from "../../store/useBookInfoStore";
import bookEx from "../../assets/common/book-cover-ex.svg";
const Archiving = ({ onBookSelect }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBookInfo } = useBookInfoStore();

  const {
    data: sortedBookListData = { bookList: [] },
    isError,
    error,
  } = useQuery({
    queryKey: ["sortedBookListData"],
    queryFn: () => getSortedTotalBook(["READING"], "latest"),
  });

  const handleRecording = (bookInfo) => {
    if (onBookSelect) {
      onBookSelect(bookInfo);
    } else {
      setBookInfo(bookInfo);
      
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
      {sortedBookListData &&
        sortedBookListData.bookList.map((book) => (
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
export default Archiving;
