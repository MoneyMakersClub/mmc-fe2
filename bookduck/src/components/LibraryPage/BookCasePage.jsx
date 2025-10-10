import BookCaseComponent from "./BookCaseComponent";
import BottomNavbar from "../common/BottomNavbar";
import DeleteModal from "../common/modal/DeleteModal";
import { useEffect, useState } from "react";
import BottomSheetModal2 from "../BookInfoPage/BottomSheetModal2";
import book_case_ex1 from "../../assets/libraryPage/bookcase-ex1.svg";
import book_case_ex2 from "../../assets/libraryPage/bookcase-ex2.svg";
import book_case_ex3 from "../../assets/libraryPage/bookcase-ex3.svg";
import { deleteFolder, getTotalFolder } from "../../api/library";
import { useQuery } from "@tanstack/react-query";
import { useOptimisticUpdate } from "../../hooks/useOptimisticUpdate";

const BookCasePage = ({ showAddBookCaseBottomSheet, bookCaseId }) => {
  const { mutate } = useOptimisticUpdate();
  const [showMenuBottomSheet, setShowMenuBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [folderId, setFolderId] = useState();

  const {
    data: totalFolderData,
    isError,
    error,
  } = useQuery({
    queryKey: ["totalFolderData"],
    queryFn: () => getTotalFolder(),
  });

  const handleCancel = () => {
    setVisible(false); // 닫는 애니메이션 시작
    setTimeout(() => {
      setShowMenuBottomSheet(false); // 애니메이션이 끝난 후 모달 완전히 닫기
    }, 300);
  };

  //메뉴 바텀시트에서 삭제 버튼 누르면 실행
  const handleDelete = () => {
    handleCancel();
    setShowDeleteModal(true);
  };

  //삭제 모달창에서 삭제 버튼 누르면 실행
  const handleDeleteModal = async () => {
    setShowDeleteModal(false);
    
    await mutate({
      apiCall: () => deleteFolder(folderId),
      queryKeys: ["totalFolderData"],
    });
  };

  //삭제 모달창에서 취소 버튼 누르면 실행
  const handleCancelModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div>
        <div className="flex flex-col gap-4 mt-4 mx-4">
          {totalFolderData.allFolderList.map((folder, index) => (
            <BookCaseComponent
              key={index}
              bookCaseTitle={folder.folderName}
              bookList={folder.folderBookCoverList}
              bookCaseId={folder.folderId}
              setShowMenuBottomSheet={setShowMenuBottomSheet}
              setFolderId={setFolderId}
            />
          ))}
        </div>
        <div className="h-[6rem] bg-transparent"></div>
      </div>
      {!showAddBookCaseBottomSheet &&
        !showMenuBottomSheet &&
        !showDeleteModal && <BottomNavbar />}
      {showMenuBottomSheet && (
        <BottomSheetModal2
          bottomSheetShow={showMenuBottomSheet}
          setBottomSheetShow={setShowMenuBottomSheet}
          visible={visible}
          setVisible={setVisible}
          handleDelete={handleDelete}
          deleteOnly={true}
        ></BottomSheetModal2>
      )}
      {showDeleteModal && (
        <DeleteModal
          title="정말 삭제하시겠어요?"
          content="삭제된 카드는 다시 복구할 수 없어요."
          leftBtnText="삭제"
          rightBtnText="취소"
          onLeftClick={handleDeleteModal}
          onRightClick={handleCancelModal}
        />
      )}
    </>
  );
};
export default BookCasePage;
