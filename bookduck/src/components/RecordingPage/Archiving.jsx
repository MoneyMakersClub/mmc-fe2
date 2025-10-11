import { useNavigate } from "react-router-dom";
import BookListView from "../common/BookListView";
import { useQuery } from "@tanstack/react-query";
import { getSortedTotalBook } from "../../api/library";
import useBookInfoStore from "../../store/useBookInfoStore";
import bookEx from "../../assets/common/book-cover-ex.svg";
const Archiving = ({ onBookSelect }) => {
  const navigate = useNavigate();
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
    console.log(bookInfo);
    if (onBookSelect) {
      onBookSelect(bookInfo);
    } else {
      setBookInfo(bookInfo);
      navigate("/recording");
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
