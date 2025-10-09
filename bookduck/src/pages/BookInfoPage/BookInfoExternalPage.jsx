import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import BookInfo from "../../components/BookInfoPage/BookInfo";
import TabBarComponent from "../../components/common/TabBarComponent";
import InfoView from "../../components/BookInfoPage/InfoView";
import ArchiveView from "../../components/BookInfoPage/ArchiveView";
import FloatingRecordButton from "../../components/common/FloatingRecordButton";
import MyComment from "../../components/BookInfoPage/MyComment";
import { getBookExternalInfo, getOneLineRatingsInfo } from "../../api/bookinfo";

const BookInfoExternalPage = () => {
  const { providerId } = useParams();
  const [activeTab, setActiveTab] = useState("책 정보");
  const [bookData, setBookData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBookExternalInfo({ providerId });
        console.log("조회성공: ", res);
        setBookData(res);
      } catch (err) {
        console.error("오류 발생: ", err);
      }
    };
    fetchData();
  }, [providerId]);

  return (
    <div className="w-[24.5625rem]">
      <NavigationHeader title="" />
      <div className="flex flex-col mt-2 gap-5">
        <div className="flex flex-col gap-2 px-4">
          <div className="flex flex-col gap-5">
            <BookInfo bookData={bookData} />
            <MyComment bookData={bookData} />
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-4">
          <TabBarComponent
            tabs={["책 정보", "기록"]}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            size=""
          />

          {activeTab === "책 정보" && (
            <InfoView bookData={bookData?.bookInfoDetailDto} />
          )}
          <div className="fixed bottom-[2.625rem] flex justify-end w-[24.5625rem] cursor-pointer">
            <FloatingRecordButton />
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookInfoExternalPage;
