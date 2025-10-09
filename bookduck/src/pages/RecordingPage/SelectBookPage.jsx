import { useState } from "react";
import NavigationHeader from "../../components/common/NavigationHeader";
import Archiving from "../../components/RecordingPage/Archiving";
import Search from "../../components/RecordingPage/Search";
import Library from "../../components/RecordingPage/Library";
import DirectRegister from "../../components/RecordingPage/DirectRegister";
import TabBarComponent from "../../components/common/TabBarComponent";

const SelectBookPage = () => {
  const [tab, setTab] = useState("읽고 있어요");

  const handleTab = (index) => {
    setTab(index);
  };

  return (
    <>
      <div className="">
        <NavigationHeader title="기록할 책 선택" />
        <div className="">
          <div className=" flex justify-center items-center h-[2.75rem] mb-[0.75rem] border-b-[0.1375rem] border-gray-50">
            <TabBarComponent
              tabs={["읽고 있어요", "서재", "검색하기", "직접 등록"]}
              activeTab={tab}
              onTabClick={handleTab}
              size="big"
              borderWidth="4rem"
            />
          </div>
          {tab === "읽고 있어요" && <Archiving />}
          {tab === "서재" && <Library />}
          {tab === "검색하기" && <Search />}
          {tab === "직접 등록" && <DirectRegister />}
        </div>
      </div>
    </>
  );
};
export default SelectBookPage;
