import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../api/example";
import NavigationHeader from "../../components/common/NavigationHeader";
import OneBookCard from "../../components/MainPage/OneBookCard";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import SearchComponent from "../../components/common/SearchComponent";
import BookListView from "../../components/common/BookListView";
import ButtonComponent from "../../components/common/ButtonComponent";

const SelectCustomPage = () => {
  //상태 관리
  const location = useLocation();
  const navigate = useNavigate();
  const bookNumber = location.state?.bookNumber;
  const [selected, setSelected] = useState("firstBook");
  const [firstImg, setFirstImg] = useState();
  const [secondImg, setSecondImg] = useState();
  const [firstId, setFirstId] = useState();
  const [secondId, setSecondId] = useState();

  const [search, setSearch] = useState("");
  const [bottomSheetShow, setBottomSheetShow] = useState(true);
  const [visible, setVisible] = useState(true);

  const [books, setBooks] = useState([]);
  const [enabled, setEnabled] = useState(false);

  const [cardData, setCardData] = useState({
    cardType: "BOOK_WITH_SONG",
    resourceId1: null,
    resourceId2: null,
    text1: "",
    text2: "",
    text3: "",
  });

  //API 연결
  //리스트 책 받아오기
  const getBooks = async () => {
    try {
      const response = await get(`/books/list?sort=latest`);
      setBooks(response.bookList);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  // 카드 등록하기
  const postCard = async () => {
    try {
      console.log("cardData", cardData);
      const response = await post(`/readingspace`, cardData);
      console.log("Card successfully posted:card Data:", response);
    } catch (error) {
      console.error("Error posting card:", error);
    }
  };

  //useEffect hook
  useEffect(() => {
    console.log("books", books);
    getBooks();
  }, []);

  //첫번째 책 아이디
  useEffect(() => {
    if (firstId) {
      console.log("선택된 책 ID 1:", firstId);
    }
  }, [firstId]);

  //두번째 책 아이디
  useEffect(() => {
    if (secondId) {
      console.log("선택된 책 ID 2:", secondId);
    }
  }, [secondId]);

  //enabled
  useEffect(() => {
    console.log(enabled);
  }, [enabled]);

  //이벤트 핸들러
  const handleStatusClick = (userBookId, bookImg) => {
    if (selected === "firstBook") {
      setFirstId(userBookId);
      setFirstImg(bookImg);
    } else if (selected === "secondBook") {
      setSecondId(userBookId);
      setSecondImg(bookImg);
    }

    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);
  };

  const handleSubmitClick = async () => {
    await postCard();
    navigate("/home");
    window.location.reload();
  };
  return (
    <div className="w-full">
      <NavigationHeader title="커스텀 위젯" />
      <div className="mt-[2.63rem] px-5">
        <OneBookCard
          bookNumber={bookNumber}
          firstImg={firstImg}
          secondImg={secondImg}
          firstId={firstId}
          secondId={secondId}
          selected={selected}
          bottomSheetShow={bottomSheetShow}
          setBottomSheetShow={setBottomSheetShow}
          setSelected={setSelected}
          setVisible={setVisible}
          setEnabled={setEnabled}
          setCardData={setCardData}
        />
      </div>
      <div className="w-full h-[12.75rem] flex flex-col fixed bottom-0 bg-gray-50 items-center py-8 text-gray-400 text-b2">
        <p>꾸미기 카드는 수정이 불가능해요.</p>
        <p className="mb-[2.3rem]">꼼꼼히 확인해주세요:)</p>
        <ButtonComponent
          text="완료"
          type="primary"
          disabled={!enabled}
          onClick={handleSubmitClick}
        />
      </div>
      <BottomSheetModal
        color="white"
        height="32.4375rem"
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        custom={true}
        setVisible={setVisible}
      >
        <div className="">
          <SearchComponent
            search={search}
            setSearch={setSearch}
            custom={true}
            placeholder="내 서재에서 책을 검색하세요"
          />
        </div>

        <div className="px-4">
          {books.map((book, index) => (
            <BookListView
              key={index}
              bookTitle={book.title}
              author={book.author}
              edit={false}
              bookImg={book.imgPath}
              rating={book.rating}
              handleOnClick={() =>
                handleStatusClick(book.userBookId, book.imgPath)
              }
            />
          ))}
        </div>
      </BottomSheetModal>
    </div>
  );
};

export default SelectCustomPage;
