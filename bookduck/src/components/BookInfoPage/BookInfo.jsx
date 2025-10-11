import { useState, useEffect } from "react";
import down from "../../assets/common/down-arrow.svg";
import BottomSheetModal from "../common/BottomSheetModal";
import ListBottomSheet from "../common/ListBottomSheet";
import imgEx from "../../assets/common/bookImg-ex.svg";
import { patch } from "../../api/example";
import { getReadingStatusKor, getReadingStatusKey, statusArr } from "../../utils/bookStatus";

const BookInfo = ({ isMe = "default", bookData }) => {
  const bookBasicData = isMe === "default" ? bookData?.bookInfoBasicDto : bookData;

  const [currentState, setCurrentState] = useState(
    getReadingStatusKor(bookBasicData?.readStatus) || "읽고 싶어요"
  );
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isCancel, setCancel] = useState(true);

  useEffect(() => {
    if (bookBasicData?.readStatus) {
      setCurrentState(getReadingStatusKor(bookBasicData.readStatus));
    }
  }, [bookBasicData?.readStatus]);

  const handleStatusClick = () => {
    setBottomSheetShow(true);
  };

  const handleStatusChange = async (status) => {
    setCurrentState(status);
    
    if (bookBasicData?.userbookId) {
      try {
        const statusKey = getReadingStatusKey(status);
        await patch(`/books/${bookBasicData.userbookId}?status=${statusKey}`);
        setVisible(false);
        setTimeout(() => {
          setBottomSheetShow(false);
        }, 200);
        // 페이지 새로고침으로 데이터 갱신
        window.location.reload();
      } catch (error) {
        console.error("책 상태 변경 업데이트 오류:", error);
      }
    }
  };

  const handlePutCancel = () => {};
  console.log(bookBasicData);
  // 기본으로 등록되어 있는 책: default 내가 직접 등록한 책: me 타유저가 직접 등록한 책: other
  return (
    <div className="flex gap-4 w-full">
      <img
        className="w-[7rem] h-[9.75rem] rounded bg-cover bg-no-repeat shadow-custom"
        src={bookBasicData?.imgPath ? bookBasicData?.imgPath : imgEx}
        alt="Cover"
      />
      <div className={`flex flex-col justify-between py-2 w-full`}>
        <div
          className={`flex flex-col ${
            isMe === "other" ? "justify-center" : ""
          }  gap-1`}
        >
          <div className="text-t2 font-semibold">{bookBasicData?.title}</div>
          <div className="text-b1 h-6">{bookBasicData?.author}</div>
        </div>
        <div className="flex flex-col mt-1 justify-between h-full">
          {isMe === "other" ? (
            <div className="text-b2 text-orange-400">
              유저닉네임님이 등록한 책
            </div>
          ) : (
            <div
              className={`flex flex-col ${
                isMe === "other" ? "" : "justify-between h-full"
              }  `}
            >
              {isMe === "default" ? (
                <></>
              ) : (
                <div className="text-b2 text-orange-400">내가 등록한 책</div>
              )}

              <div
                className="flex py-1.5 text-b2 text-gray-500 "
                onClick={handleStatusClick}
              >
                {currentState}
                <img src={down} />
              </div>
              {bottomSheetShow && (
                <BottomSheetModal
                  bottomSheetShow={bottomSheetShow}
                  setBottomSheetShow={setBottomSheetShow}
                  visible={visible}
                  setVisible={setVisible}
                >
                  {" "}
                  <div className="px-4">
                    <ListBottomSheet
                      title="책 상태"
                      options={statusArr}
                      currentOption={currentState}
                      handleOption={handleStatusChange}
                      isCancel={isCancel}
                      handlePutCancel={handlePutCancel}
                    />
                  </div>
                </BottomSheetModal>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default BookInfo;
