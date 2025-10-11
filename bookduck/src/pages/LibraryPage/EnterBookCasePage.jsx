import NavigationHeader from "../../components/common/NavigationHeader";
import BasicHeader from "../../components/common/BasicHeader";
import ListIcon from "../../components/LibraryPage/ListIcon";
import CoverIcon from "../../components/LibraryPage/CoverIcon";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useBookListStore from "../../store/useBookListStore";
import BookListView from "../../components/common/BookListView";
import BookComponent from "../../components/SearchPage/BookComponent";
import ButtonComponent from "../../components/common/ButtonComponent";
import EditBookListView from "../../components/common/EditBookListView";
import add_book_btn from "../../assets/libraryPage/add-book-btn.svg";
import RoundedTabComponent from "../../components/common/RoundedTabComponent";
import imgEx from "../../assets/common/bookImg-ex.svg";
import {
  deleteAddFolderBook,
  getBookFromFolder,
  getSortedTotalBook,
  getTotalBook,
  patchFolderName,
  postAddFolderBook,
} from "../../api/library";
import { useQuery } from "@tanstack/react-query";
import { getReadingStatusKor, getReadingStatusKey } from "../../utils/bookStatus";
import { useOptimisticUpdate } from "../../hooks/useOptimisticUpdate";

const EnterBookCasePage = () => {
  const { id } = useParams(); // URL에서 id를 추출
  const [isClicked, setIsClicked] = useState("list");
  const [editState, setEditState] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [addBookState, setAddBookState] = useState(false);
  const [tabList, setTabList] = useState([]);
  const [bookList, setBookList] = useState([]);
  const [sortedBookList, setSortedBookList] = useState([]);
  const [selectedBookList, setSelectedBookList] = useState([]);
  const [selectedFolderBookId, setSelectedFolderBookId] = useState([]);

  const navigate = useNavigate();
  const { mutate } = useOptimisticUpdate();

  const {
    data: folderBookListData = { bookList: [] },
    isError,
    error,
  } = useQuery({
    queryKey: ["folderBookListData", id],
    queryFn: () => getBookFromFolder(id),
  });

  useEffect(() => {
    setInputValue(folderBookListData.folderName);
  }, []);

  //편집 시 BookListView 클릭 (재클릭하면 클릭 취소)
  const handleItemClick = (index, bookId, folderBookId) => {
    setSelectedIndex((prev) =>
      prev.includes(index) ? prev.filter((t) => t !== index) : [...prev, index]
    );
    setSelectedBookList((prev) =>
      prev.includes(bookId)
        ? prev.filter((t) => t !== bookId)
        : [...prev, bookId]
    );

    setSelectedFolderBookId((prev) =>
      prev.includes(folderBookId)
        ? prev.filter((t) => t !== folderBookId)
        : [...prev, folderBookId]
    );
  };

  const handleIconClick = (view) => {
    setIsClicked(view);
  };

  const handleEdit = async () => {
    if (editState) {
      await mutate({
        apiCall: () => patchFolderName(id, { folderName: inputValue }),
        queryKeys: [["folderBookListData", id]],
      });
    }
    setEditState(!editState);
    setSelectedIndex([]);
  };

  const handleAddBook = async () => {
    setAddBookState(true);
    const res = await getTotalBook("latest");
    setBookList(res.bookList);
  };

  const handleTabClick = (tab) => {
    setTabList((prev) =>
      prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]
    );
  };

  useEffect(() => {
    const selectSortedList = async () => {
      const statusList = tabList.map((it) => getReadingStatusKey(it));
      console.log(statusList);
      const res = await getSortedTotalBook(statusList, "latest");
      setSortedBookList(res.bookList);
    };
    if (tabList.length !== 0) {
      selectSortedList();
    }
  }, [tabList]);

  const handleButtonClick = async () => {
    const apiCall = addBookState
      ? () => postAddFolderBook(id, selectedBookList)
      : () => deleteAddFolderBook(id, selectedFolderBookId);

    await mutate({
      apiCall,
      queryKeys: [["folderBookListData", id]],
      onSuccess: () => {
        setAddBookState(false);
        setSelectedBookList([]);
        setSelectedFolderBookId([]);
        setSelectedIndex([]);
      },
    });
  };

  return (
    <>
      {editState ? (
        <NavigationHeader
          title="책장 편집"
          edit={true}
          editState={editState}
          handleEdit={handleEdit}
        />
      ) : addBookState ? (
        <NavigationHeader title="책 추가하기" />
      ) : (
        <NavigationHeader
          title=""
          edit={true}
          editState={editState}
          handleEdit={handleEdit}
        />
      )}
      <div className="relative flex flex-col">
        {editState ? (
          <>
            <div className="flex flex-col gap-2 mx-4 mt-4 mb-5">
              <div className="text-c1 text-blue-400">책장 이름</div>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="책장명"
                className="text-b1 text-gray-800"
              />
            </div>
          </>
        ) : (
          !addBookState && (
            <>
              <BasicHeader title={folderBookListData.folderName} />
              <div className="absolute right-4 top-4 ">
                <div className="flex gap-2 cursor-pointer">
                  <ListIcon
                    handleClick={handleIconClick}
                    isClicked={isClicked}
                  />
                  <CoverIcon
                    handleClick={handleIconClick}
                    isClicked={isClicked}
                  />
                </div>
              </div>
            </>
          )
        )}
        {!addBookState && folderBookListData.folderBookList.length === 0 ? (
          <div className="mt-[6.62rem] text-b2 text-gray-500 text-center">
            아직 추가된 책이 없어요. <br /> 아래 버튼을 눌러 책을 추가하세요!
          </div>
        ) : (
          <>
            {isClicked === "list" && !editState && !addBookState && (
              <>
                <div className="h-[42rem] mx-4 overflow-y-auto">
                  {folderBookListData &&
                    folderBookListData.folderBookList.map((book, index) => (
                      <div key={index}>
                        <BookListView
                          register={book.isCustom}
                          bookTitle={book.title}
                          author={book.author}
                          edit={true}
                          bookImg={book.imgPath ? book.imgPath : imgEx}
                          handleOnClick={() => {}}
                        />
                      </div>
                    ))}
                </div>
              </>
            )}

            {isClicked === "cover" && !editState && !addBookState && (
              <div className="h-[42rem] mx-4 overflow-y-auto">
                <div className="grid grid-cols-3 place-items-center gap-x-3 gap-y-5">
                  {folderBookListData &&
                    folderBookListData.folderBookList.map((book, index) => (
                      <div key={index}>
                        <BookComponent
                          img={book.imgPath ? book.imgPath : imgEx}
                          title={book.title}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            {editState && (
              <div className="h-[42rem] overflow-y-auto">
                {folderBookListData &&
                  folderBookListData.folderBookList.map((book, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleItemClick(
                          index,
                          book.userBookId,
                          book.folderBookId
                        )
                      }
                      className={`${
                        selectedIndex.includes(index) ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className=" mx-4">
                        <EditBookListView
                          bookTitle={book.title}
                          author={book.author}
                          edit={true}
                          addBook={false}
                          bookImg={book.imgPath ? book.imgPath : imgEx}
                          isSelected={selectedIndex.includes(index)}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {addBookState && (
              <>
                <div className="m-4">
                  <RoundedTabComponent
                    type="secondary"
                    tabs={[
                      "읽고 싶어요",
                      "읽고 있어요",
                      "다 읽었어요",
                      "중단했어요",
                    ]}
                    activeTabs={tabList}
                    onTabClick={handleTabClick}
                    multiple={true}
                  />
                </div>

                <div className="h-[42rem] overflow-y-auto">
                  {tabList.length === 0
                    ? bookList &&
                      bookList.map((book, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleItemClick(
                              index,
                              book.userBookId,
                              book.folderBookId
                            )
                          }
                          className={`${
                            selectedIndex.includes(index) ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className=" mx-4">
                            <EditBookListView
                              bookTitle={book.title}
                              author={book.author}
                              edit={false}
                              addBook={true}
                              bookImg={book.imgPath ? book.imgPath : imgEx}
                              rating={book.rating}
                              isSelected={selectedIndex.includes(index)}
                              initState={getReadingStatusKor(book.readStatus)}
                            />
                          </div>
                        </div>
                      ))
                    : sortedBookList.map((book, index) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleItemClick(
                              index,
                              book.userBookId,
                              book.folderBookId
                            )
                          }
                          className={`${
                            selectedIndex.includes(index) ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className=" mx-4">
                            <EditBookListView
                              bookTitle={book.title}
                              author={book.author}
                              edit={false}
                              addBook={true}
                              bookImg={book.imgPath}
                              rating={book.rating}
                              isSelected={selectedIndex.includes(index)}
                              initState={getReadingStatusKor(book.readStatus)}
                            />
                          </div>
                        </div>
                      ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {!editState && !addBookState && (
        <div
          onClick={() => handleAddBook(true)}
          className="fixed bottom-[2.63rem] flex justify-end w-[24.5625rem] pr-4 cursor-pointer"
        >
          <img src={add_book_btn} alt="add_book_btn" />
        </div>
      )}
      {(editState || addBookState) && (
        <div className="fixed bottom-0 w-[24.5625rem] h-22 bg-white">
          <div className="flex justify-center mt-[0.38rem] mb-[2.12rem]">
            <ButtonComponent
              text={`${
                addBookState
                  ? `완료 (${selectedIndex.length})`
                  : `삭제 (${selectedIndex.length})`
              }`}
              type="primary"
              disabled={selectedIndex.length === 0}
              onClick={handleButtonClick}
            />
          </div>
        </div>
      )}
    </>
  );
};
export default EnterBookCasePage;
