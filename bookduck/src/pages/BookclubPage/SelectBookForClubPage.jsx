import { useState } from "react";
import NavigationHeader from "../../components/common/NavigationHeader";
import Archiving from "../../components/RecordingPage/Archiving";
import Search from "../../components/RecordingPage/Search";
import Library from "../../components/RecordingPage/Library";
import DirectRegister from "../../components/RecordingPage/DirectRegister";
import TabBarComponent from "../../components/common/TabBarComponent";
import useBookInfoStore from "../../store/useBookInfoStore";
import { useNavigate } from "react-router-dom";

const SelectBookForClubPage = () => {
  const [tab, setTab] = useState("검색하기");
  const { setSelectedBookInfo } = useBookInfoStore();
  const navigate = useNavigate();

  const handleTab = (index) => {
    setTab(index);
  };

  const handleBookSelect = (bookInfo) => {
    setSelectedBookInfo(bookInfo);
    navigate("/bookclub/create", { replace: true });
  };

  return (
    <>
      <div className="">
        <NavigationHeader title="함께 읽을 책 선택" />
        <div className="pt-[calc(env(safe-area-inset-top)+2.75rem)]">
          <div className=" flex justify-center items-center h-[2.75rem] mb-[0.75rem] border-b-[0.1375rem] border-gray-50">
            <TabBarComponent
              tabs={["읽고 있어요", "서재", "검색하기", "직접 등록"]}
              activeTab={tab}
              onTabClick={handleTab}
              size="big"
              borderWidth="4rem"
            />
          </div>
          {tab === "읽고 있어요" && <Archiving onBookSelect={handleBookSelect} />}
          {tab === "서재" && <Library onBookSelect={handleBookSelect} />}
          {tab === "검색하기" && <Search onBookSelect={handleBookSelect} />}
          {tab === "직접 등록" && <DirectRegister onBookSelect={handleBookSelect} />}
        </div>
      </div>
    </>
  );
};

export default SelectBookForClubPage;
