import { useNavigate } from "react-router-dom";
import horizontal_menu from "../../assets/common/horizontal-menu-gray.svg";
import useBookListStore from "../../store/useBookListStore";
import imgEx from "../../assets/common/bookImg-ex.svg";

const BookCaseComponent = ({
  setShowMenuBottomSheet,
  bookCaseTitle = "책장명",
  bookList = [],
  bookCaseId,
  setFolderId,
}) => {
  const { setBookList } = useBookListStore();
  const navigate = useNavigate();
  const handleBookCase = () => {
    setBookList(bookList);
    navigate(`/library/bookcase/${bookCaseId}`);
  };
  return (
    <>
      <div
        onClick={handleBookCase}
        className="p-4 border-[0.0625rem] border-gray-100 rounded-[0.5rem] bg-gray-10 cursor-pointer"
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-[0.12rem]">
              <div className="text-b2 text-gray-800">{bookCaseTitle}</div>
              <div className="text-b2 text-orange-400">({bookList.length})</div>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                setShowMenuBottomSheet(true);
                setFolderId(bookCaseId);
              }}
              className="cursor-pointer"
            >
              <img src={horizontal_menu} />
            </div>
          </div>
          <div className="flex gap-2 w-[20.6rem] overflow-x-auto">
            {bookList.map((it, index) => (
              <div key={index} className="w-16 h-23 flex-shrink-0">
                <img
                  src={it.imgPath ? it.imgPath : imgEx}
                  className="w-full h-full object-cover rounded-[0.25rem]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default BookCaseComponent;
