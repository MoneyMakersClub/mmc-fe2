import { useState, useEffect } from "react";
import starNo from "../../assets/bookinfoPage/star-no.svg";
import starYes from "../../assets/bookinfoPage/star-yes.svg";
import starHalf from "../../assets/bookinfoPage/star-half.svg";
import leftMark from "../../assets/bookinfoPage/left-quotmark.svg";
import rightMark from "../../assets/bookinfoPage/right-quotmark.svg";
import menu from "../../assets/bookinfoPage/menu-vertical.svg";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import ButtonComponent from "../common/ButtonComponent";
import BottomSheetModal2 from "./BottomSheetModal2";
import {
  enrollRating,
  deleteRating,
  enrollOneLine,
  editOneLine,
  deleteOneLine,
} from "../../api/bookinfo";
import { useOptimisticUpdate } from "../../hooks/useOptimisticUpdate";

const MyComment = ({ bookData }) => {
  const { mutate } = useOptimisticUpdate();
  const bookInfo = bookData?.bookInfoBasicDto;
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [bottomSheet2Show, setBottomSheet2Show] = useState(false);
  const [editSheetShow, setEditSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [editVisible, setEditVisible] = useState(false);

  const [inputValue, setInputValue] = useState(bookData?.myOneLine || "");
  const [text, setText] = useState(bookData?.myOneLine || "");
  const [rating, setRating] = useState(0);

  // bookData.myRating 값이 바뀔 때 rating 상태를 업데이트
  useEffect(() => {
    if (bookInfo?.myRating) {
      setRating(bookInfo.myRating);
    }
    if (bookData?.myOneLine) {
      setText(bookData.myOneLine);
      setInputValue(bookData.myOneLine);
    }
  }, [bookData, bookInfo]);

  const handleChange = (event) => {
    const { value } = event.target;
    if (value.length <= 25) {
      setInputValue(value);
    }
  };

  const handleCancleClick = () => {
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);
  };

  const handleEditCancleClick = () => {
    setEditVisible(false);
    setTimeout(() => {
      setEditSheetShow(false);
    }, 200);
  };

  // 수정하기 버튼 누르면 수정 바텀시트 올라오도록 설정
  const handleEdit = () => {
    setBottomSheet2Show(false);
    setVisible2(false);
    setEditSheetShow(true);
  };

  // 한줄평 등록
  const handleCompleteClick = async (userbookId, oneLineContent) => {
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);

    await mutate({
      apiCall: () => enrollOneLine(userbookId, oneLineContent),
      queryKeys: ["bookInfoData"],
      optimisticUpdate: () => setText(inputValue),
      rollback: () => setText(bookData?.myOneLine || ""),
    });
  };

  // 한줄평 수정
  const handleEditClick = async (onelineId, oneLineContent) => {
    setEditVisible(false);
    setTimeout(() => {
      setEditSheetShow(false);
    }, 200);

    await mutate({
      apiCall: () => editOneLine(onelineId, oneLineContent),
      queryKeys: ["bookInfoData"],
      optimisticUpdate: () => setText(inputValue),
      rollback: () => setText(bookData?.myOneLine || ""),
    });
  };

  // 한줄평 삭제
  const handleDeleteClick = async (onelineId) => {
    setVisible2(false);
    setTimeout(() => {
      setBottomSheet2Show(false);
    }, 200);

    await mutate({
      apiCall: () => deleteOneLine(onelineId),
      queryKeys: ["bookInfoData"],
      optimisticUpdate: () => {
        setText("");
        setInputValue("");
      },
      rollback: () => {
        setText(bookData?.myOneLine || "");
        setInputValue(bookData?.myOneLine || "");
      },
    });
  };

  const handleStarClick = async (index, event) => {
    const { offsetX, target } = event.nativeEvent;
    const starWidth = target.offsetWidth;
    let newRating = offsetX < starWidth / 2 ? index + 0.5 : index + 1;

    // 최소 별점 1점 적용
    if (newRating < 1) {
      newRating = 1;
    }

    if (rating === newRating) {
      setRating(0);
      try {
        await deleteRating(bookInfo.userbookId);
      } catch (error) {
        console.error(error);
      }
    } else {
      setRating(newRating);
      try {
        await enrollRating(bookInfo.userbookId, newRating);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      {bookInfo?.userbookId ? (
        <div>
          {text ? (
            <div>
              <div className="relative flex flex-col items-center p-5 gap-4 bg-gray-10 w-[22.5625rem] rounded-lg">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    let starSrc = starNo;
                    if (rating > index) {
                      starSrc = rating >= index + 1 ? starYes : starHalf;
                    }
                    return (
                      <img
                        className="cursor-pointer"
                        key={index}
                        src={starSrc}
                        onClick={(event) => handleStarClick(index, event)}
                        alt="star"
                      />
                    );
                  })}
                </div>
                <div className="flex justify-center items-center gap-2 max-h-12 text-b2">
                  <img src={leftMark} alt="left-quotation" />
                  {text}
                  <img src={rightMark} alt="right-quotation" />
                </div>
                <img
                  className="absolute top-5 right-5 cursor-pointer"
                  src={menu}
                  alt="menu"
                  onClick={() => setBottomSheet2Show(true)}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col items-center px-4 pt-4 pb-5 gap-2 bg-gray-10 w-[22.5625rem] rounded-lg">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => {
                    let starSrc = starNo;
                    if (rating > index) {
                      starSrc = rating >= index + 1 ? starYes : starHalf;
                    }
                    return (
                      <img
                        className="cursor-pointer"
                        key={index}
                        src={starSrc}
                        onClick={(event) => handleStarClick(index, event)}
                        alt="star"
                      />
                    );
                  })}
                </div>
                <input
                  type="text"
                  className="w-full px-1 py-2 text-b2 text-gray-400 border-b border-[#DDDDDD]"
                  placeholder="책에 대한 나의 한줄 평을 작성해주세요!"
                  onClick={() => setBottomSheetShow(true)}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 text-b2 text-gray-400 text-center w-[361px] rounded-lg ">
          책을 서재에 담아
          <br />
          별점과 한줄평을 입력해보세요
        </div>
      )}
      <BottomSheetModal
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        setVisible={setVisible}
      >
        <div className="flex flex-col px-4">
          <div className="flex justify-between items-center">
            <span className="text-st font-semibold">한줄평 작성</span>
            <span
              className="text-b1 text-gray-500 cursor-pointer"
              onClick={handleCancleClick}
            >
              취소
            </span>
          </div>
          <input
            type="text"
            value={inputValue}
            className="mt-[1.625rem] mb-[3.1875rem] px-1 py-2 text-b1 placeholder:text-gray-400 border-b border-[#DDDDDD] w-full"
            placeholder="책에 대한 나의 한줄 평을 작성해주세요! (25자 이내)"
            onChange={handleChange}
          />
          <ButtonComponent
            text="완료"
            disabled={!inputValue}
            onClick={() => handleCompleteClick(bookInfo.userbookId, inputValue)}
          />
        </div>
      </BottomSheetModal>
      <BottomSheetModal2
        bottomSheetShow={bottomSheet2Show}
        setBottomSheetShow={setBottomSheet2Show}
        visible={visible2}
        setVisible={setVisible2}
        handleEdit={handleEdit}
        handleDelete={() => handleDeleteClick(bookData?.oneLineId)}
      />
      <BottomSheetModal
        bottomSheetShow={editSheetShow}
        setBottomSheetShow={setEditSheetShow}
        visible={editVisible}
        setVisible={setEditVisible}
      >
        <div className="flex flex-col px-4">
          <div className="flex justify-between items-center">
            <span className="text-st font-semibold">한줄평 수정</span>
            <span
              className="text-b1 text-gray-500 cursor-pointer"
              onClick={handleEditCancleClick}
            >
              취소
            </span>
          </div>
          <input
            type="text"
            value={inputValue}
            className="mt-[1.625rem] mb-[3.1875rem] px-1 py-2 text-b1 placeholder:text-gray-400 border-b border-[#DDDDDD] w-full"
            placeholder="책에 대한 나의 한줄 평을 작성해주세요! (25자 이내)"
            onChange={handleChange}
          />
          <ButtonComponent
            text="완료"
            disabled={!inputValue}
            onClick={() => handleEditClick(bookData?.oneLineId, inputValue)}
          />
        </div>
      </BottomSheetModal>
    </div>
  );
};

export default MyComment;
