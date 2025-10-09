import { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import polygon from "../../assets/characterPage/polygon.svg";
import noArchive from "../../assets/bookinfoPage/user-no-archive.svg";
import BookInfo from "../../components/BookInfoPage/BookInfo";
import ArchiveView from "../../components/BookInfoPage/ArchiveView";
import FloatingRecordButton from "../../components/common/FloatingRecordButton";
import MyComment from "../../components/BookInfoPage/MyComment";
import Header2 from "../../components/RecordingPage/Header2";
import NavigationHeader from "../../components/common/NavigationHeader";
import { getCustomBookInfo } from "../../api/bookinfo";
import SuspenseLoading from "../../components/common/SuspenseLoading"; // 로딩 컴포넌트

// 유저가 직접 추가한 책 정보 페이지
const BookInfoAddedPage = () => {
  const { bookinfoId } = useParams();
  const [bookData, setBookData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // 로딩 시작
        const res = await getCustomBookInfo({ bookinfoId });
        console.log("조회성공: ", res);
        setBookData(res);
      } catch (err) {
        console.error("오류 발생: ", err);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };
    fetchData();
  }, [bookinfoId]);

  console.log("bookdata", bookData);
  const [activeTab, setActiveTab] = useState("기록");
  // api받았을때 isMe가 me이면 내가 등록한 페이지, other이면 타유저가 등록한 페이지
  const isMe = bookData?.isMine ? true : false; //true or false
  console.log(isMe);
  return (
    <div className="w-full">
      {bookData?.isMine ? (
        <div>
          <div className="px-4">
            <Header2 />
          </div>
          <div className="flex flex-col mt-2 gap-5">
            <div className="flex flex-col gap-2 px-4">
              <div className="flex flex-col gap-5">
                <BookInfo bookData={bookData} isMe={isMe} />
                <MyComment />
              </div>
            </div>
            <div>
              <div className="flex items-center text-btn2 px-4 pt-1 h-11 border-b-2 border-gray-50">
                기록
              </div>
              <ArchiveView />
            </div>
            <div className="fixed bottom-[2.625rem] flex justify-end w-[24.5625rem] cursor-pointer">
              <FloatingRecordButton />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <NavigationHeader title="" />
          <div className="flex flex-col items-center px-4 mt-4 gap-[8.875rem]">
            <BookInfo isMe={isMe} bookData={bookData} />
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <div className="flex justify-center px-6 py-2 bg-gray-50 text-center rounded-xl text-b2 font-semibold text-gray-500 ">
                  다른유저가 직접 등록한 책에는 <br />
                  기록을 남길 수 없어요.
                </div>
                <img
                  className="w-4 h-3 mt-[-0.0625rem]"
                  src={polygon}
                  alt="polygon"
                />
              </div>
              <img src={noArchive} alt="no archive" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookInfoAddedPage;
