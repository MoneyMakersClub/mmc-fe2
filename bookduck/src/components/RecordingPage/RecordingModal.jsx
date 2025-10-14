import WritingTemplate from "./WritingTemplate";
import ButtonComponent from "../common/ButtonComponent";
import camera from "../../assets/recordingPage/camera-gray.svg";
import Cards from "../../components/RecordingPage/Cards";
import cards from "../../assets/recordingPage/cards.svg";
import HighlightTextarea from "./HighlightTextarea";

const RecordingModal = ({
  bottomSheetType,
  tempPageInputValue,
  handleTempPageInputChange,
  tempExtractInputValue,
  handleExtractOnChange,
  handleExtractScroll,
  handleExtractImage,
  tempTitleInputValue,
  handleTempTitleInputChange,
  tempReviewInputValue,
  handleReviewOnChange,
  handleReviewScroll,
  reviewColor,
  handleDecoration,
  handleWriteClick,
  font,
}) => {
  return (
    <>
      {bottomSheetType === "발췌" && (
        <>
          <WritingTemplate height="18rem">
            <div className="flex flex-col gap-2">
              <div className="flex justify-end w-full">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="페이지"
                    value={tempPageInputValue}
                    onChange={handleTempPageInputChange}
                    className="w-[2.5rem] bg-transparent text-b2 text-gray-800 text-right"
                  />
                  <div className={`text-b2 text-gray-400 ${font}`}>p</div>
                </div>
              </div>
              <HighlightTextarea
                value={tempExtractInputValue}
                onChange={handleExtractOnChange}
                onScroll={handleExtractScroll}
                placeholder="책의 구절을 입력하세요"
                maxLength={300}
                height="h-[11.5rem]"
                font={font}
              />
            </div>
            <div className="absolute bottom-5 left-4">
              <label
                htmlFor="ExtractImage"
                className="flex gap-2 items-center cursor-pointer"
              >
                <img src={camera} alt="camera" />
                <div className="text-b2 text-gray-500">문장스캔</div>
              </label>
              <input
                id="ExtractImage"
                type="file"
                className="hidden"
                onChange={handleExtractImage}
              />
            </div>
            <div className="absolute bottom-5 right-4">
              <div className="text-btn3 text-gray-400">
                <span className={tempExtractInputValue.length > 300 ? "text-red" : ""}>
                  {tempExtractInputValue.length}
                </span>
                /300
              </div>
            </div>
          </WritingTemplate>
          <ButtonComponent
            text="발췌 작성"
            type="primary"
            color="gray"
            onClick={handleWriteClick}
            disabled={!tempExtractInputValue || !tempPageInputValue}
          />
        </>
      )}
      {bottomSheetType === "감상평" && (
        <>
          <WritingTemplate height="18rem">
            <div className="flex flex-col gap-2">
              <input
                value={tempTitleInputValue}
                onChange={handleTempTitleInputChange}
                placeholder="제목 (25자 이내로 작성하세요)"
                className={`text-b1 font-semibold bg-transparent ${font}`}
              />
              <HighlightTextarea
                value={tempReviewInputValue}
                onChange={handleReviewOnChange}
                onScroll={handleReviewScroll}
                placeholder="책에 대한 자유로운 감상을 기록하세요"
                maxLength={1000}
                height="h-[11rem]"
                font={font}
              />
            </div>
            <div className="absolute bottom-5 left-4">
              <div className="flex items-center cursor-pointer" onClick={handleDecoration}>
                {reviewColor ? (
                  <Cards stroke={reviewColor} />
                ) : (
                  <img src={cards} />
                )}
                <div
                  style={reviewColor ? { color: reviewColor } : undefined}
                  className={`text-b2 ml-2 ${reviewColor ? "" : "text-gray-500"}`}
                >
                  카드색상
                </div>
              </div>
            </div>
            <div className="absolute bottom-5 right-4">
              <div className="text-btn3 text-gray-400">
                <span className={tempReviewInputValue.length > 1000 ? "text-red" : ""}>
                  {tempReviewInputValue.length}
                </span>
                /1000
              </div>
            </div>
          </WritingTemplate>
          <ButtonComponent
            text="감상평 작성"
            type="primary"
            color="gray"
            onClick={handleWriteClick}
            disabled={!tempReviewInputValue}
          />
        </>
      )}
    </>
  );
};

export default RecordingModal;

