import { useNavigate } from "react-router-dom";
import BookListView from "../common/BookListView";
import { getTotalBook } from "../../api/library";
import { useQuery } from "@tanstack/react-query";
import useBookInfoStore from "../../store/useBookInfoStore";
import bookEx from "../../assets/common/bookImg-ex.svg";

const Library = ({ onBookSelect }) => {
  const navigate = useNavigate();
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
      navigate("/archive?recording=true", { replace: true });
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
