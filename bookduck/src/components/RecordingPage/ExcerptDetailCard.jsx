import { useState } from "react";
import heart_gray from "../../assets/recordingPage/heart-gray.svg";
import share_gray from "../../assets/recordingPage/share-gray.svg";
import kakao from "../../assets/recordingPage/kakao.svg";
import instagram from "../../assets/recordingPage/instagram.svg";
import x from "../../assets/recordingPage/x.svg";
import gallery from "../../assets/recordingPage/gallery.svg";
import link from "../../assets/recordingPage/link.svg";

import BottomSheetModal from "../common/BottomSheetModal";
import BottomSheetMenuComponent from "../common/BottomSheetMenuComponent";
const ExcerptDetailCard = ({ archiveDetailData, font }) => {
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCancleClick = () => {
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);
  };

  const formattedDate = (date) => {
    return date.split("T")[0].replace(/-/g, ".");
  };

  const isModified = archiveDetailData.excerpt.modifiedTime && 
    archiveDetailData.excerpt.modifiedTime !== archiveDetailData.excerpt.createdTime;
  
  const displayDate = isModified 
    ? `${formattedDate(archiveDetailData.excerpt.modifiedTime)} (수정됨)`
    : formattedDate(archiveDetailData.excerpt.createdTime);

  return (
    <div>
      <div className="w-[22.5825rem]  px-5 py-6 rounded-[0.88rem] bg-gray-10 shadow-custom  ">
        <div className="flex flex-col gap-5  ">
          <div className="flex justify-between">
            <div className={`text-c1 text-gray-400 ${font}`}>
              {displayDate}
              {archiveDetailData.excerpt.visibility === "PRIVATE" &&
                " • 나만보기"}
            </div>
            <div className={`text-b2 text-gray-400 ${font}`}>
              {archiveDetailData.excerpt.pageNumber}p
            </div>
          </div>
          <div className={`text-b2 text-gray-800 ${font}`}>
            {archiveDetailData.excerpt.excerptContent}
          </div>
          <div className=" flex gap-4 justify-end">
            <img className="cursor-pointer" src={heart_gray} alt="heart_gray" />
            <img
              className="cursor-pointer"
              src={share_gray}
              alt="share_gray"
              onClick={() => {
                setBottomSheetShow(true);
              }}
            />
          </div>
        </div>
      </div>
      <BottomSheetModal
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        setVisible={setVisible}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <span className="text-st font-semibold">내보내기</span>
            <span
              className="text-b1 text-gray-500 cursor-pointer"
              onClick={handleCancleClick}
            >
              취소
            </span>
          </div>
          <div className="flex flex-col my-4 px-1">
            <BottomSheetMenuComponent
              img={kakao}
              text="카카오톡"
              isExported={true}
            />
            <BottomSheetMenuComponent
              img={instagram}
              text="인스타그램 스토리"
              isExported={true}
            />
            <BottomSheetMenuComponent img={x} text="X" isExported={true} />
            <BottomSheetMenuComponent
              img={gallery}
              text="이미지 저장"
              isExported={true}
            />
            <BottomSheetMenuComponent
              img={link}
              text="URL 복사"
              isExported={true}
            />
          </div>
        </div>
      </BottomSheetModal>
    </div>
  );
};
export default ExcerptDetailCard;
