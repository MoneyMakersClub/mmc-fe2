import { useEffect, useState } from "react";
import TabBarComponent from "../../components/common/TabBarComponent";
import BookListPage from "../../components/LibraryPage/BookListPage";
import BookCasePage from "../../components/LibraryPage/BookCasePage";
import BasicHeader from "../../components/common/BasicHeader";
import BottomNavbar from "../../components/common/BottomNavbar";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import ButtonComponent from "../../components/common/ButtonComponent";
import ListIcon from "../../components/LibraryPage/ListIcon";
import CoverIcon from "../../components/LibraryPage/CoverIcon";
import plus_orange from "../../assets/common/plus-orange.svg";
import { postAddFolder } from "../../api/library";
import { useQueryClient } from "@tanstack/react-query";

const LibraryPage = () => {
  const queryClient = useQueryClient();
  const [isClicked, setIsClicked] = useState("list");
  const [showAddBookCaseBottomSheet, setShowAddBookCaseBottomSheet] =
    useState(false);
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [clickedPage, setClickedPage] = useState(
    localStorage.getItem("clickedPage") || "책 목록"
  );

  useEffect(() => {
    const savedPage = localStorage.getItem("clickedPage");
    if (savedPage) {
      setClickedPage(savedPage);
      console.log(1);
    }
    console.log(3);
  }, []);

  useEffect(() => {
    localStorage.setItem("clickedPage", clickedPage);
    console.log(2);
  }, [clickedPage]);

  const handleIconClick = (view) => {
    setIsClicked(view);
  };

  const handleModalCancel = () => {
    setVisible(false); // 닫는 애니메이션 시작
    setTimeout(() => {
      setShowAddBookCaseBottomSheet(false); // 애니메이션이 끝난 후 모달 완전히 닫기
    }, 300);
  };

  const handleAddFolder = async () => {
    try {
      const data = {
        folderName: inputValue,
      };
      const res = await postAddFolder(data);
      console.log(res);
      
      // 바텀시트 닫기
      setVisible(false);
      setTimeout(() => {
        setShowAddBookCaseBottomSheet(false);
      }, 300);
      
      // 입력값 초기화
      setInputValue("");
      
      // React Query 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["folderListData"] });
    } catch (error) {
      console.error("책장 추가 실패", error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col ">
        <BasicHeader title="서재" />
        <TabBarComponent
          tabs={["책 목록", "책장"]}
          activeTab={clickedPage}
          onTabClick={setClickedPage}
          size="small"
          borderWidth="3rem"
        />

        <div className="absolute  top-[3.8rem] right-[0.63rem]">
          {clickedPage === "책 목록" && (
            <div className="flex gap-2 cursor-pointer">
              <ListIcon handleClick={handleIconClick} isClicked={isClicked} />
              <CoverIcon handleClick={handleIconClick} isClicked={isClicked} />
            </div>
          )}
          {clickedPage === "책장" && (
            <div
              onClick={() => setShowAddBookCaseBottomSheet(true)}
              className="flex gap-1 items-center mr-[0.37rem] cursor-pointer"
            >
              <img src={plus_orange} />
              <div className="text-b2 text-gray-800">책장추가</div>
            </div>
          )}
        </div>

        <div>
          {clickedPage === "책 목록" && <BookListPage view={isClicked} />}
          {clickedPage === "책장" && (
            <BookCasePage
              showAddBookCaseBottomSheet={showAddBookCaseBottomSheet}
            />
          )}
        </div>
        <BottomNavbar />
      </div>
      {showAddBookCaseBottomSheet && (
        <BottomSheetModal
          bottomSheetShow={showAddBookCaseBottomSheet}
          setBottomSheetShow={setShowAddBookCaseBottomSheet}
          visible={visible}
          setVisible={setVisible}
        >
          <div className="px-4 pb-3">
            <div className="flex justify-between">
              <div className="text-st text-gray-800 font-semibold">
                책장 추가
              </div>
              <div
                onClick={handleModalCancel}
                className="text-b1 text-gray-500 cursor-pointer"
              >
                취소
              </div>
            </div>
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="책장 이름을 입력하세요"
              className="w-full mt-[1.62rem] mb-[3.19rem] px-1 py-2 border-b-[1px] border-[#DDDDDD]"
            />
            <ButtonComponent
              text="완료"
              type="primary"
              disabled={!inputValue}
              onClick={handleAddFolder}
            />
          </div>
        </BottomSheetModal>
      )}
    </>
  );
};
export default LibraryPage;
