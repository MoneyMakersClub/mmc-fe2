import { useNavigate } from "react-router-dom";
import lock from "../../assets/mainPage/lock.svg";
import heart_white from "../../assets/recordingPage/heart-white.svg";

const ClubReviewCard = ({ data, font, nickname }) => {
  const navigate = useNavigate();
  
  // 날짜 포맷
  const formattedDate = (date) => {
    if (!date) return "";
    return date.split("T")[0].replace(/-/g, ".");
  };

  const isModified = data?.modifiedTime && 
    data?.modifiedTime !== data?.createdTime;
  
  const displayDate = isModified 
    ? `${formattedDate(data?.modifiedTime)} (수정됨)`
    : formattedDate(data?.createdTime);

  return (
    <div className="w-full">
      <div 
        style={{ background: data?.color || "#FFE4B5" }}
        className="flex flex-col gap-5 rounded-2xl shadow-custom p-5"
      >
        {/* 나만보기 아이콘 */}
        {data?.visibility === "PRIVATE" && (
          <div className="flex items-center gap-1">
            <img src={lock} alt="lock" className="brightness-0 invert" />
            <span className={`text-btn4 text-white ${font}`}>나만보기</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {/* 제목 */}
          {data?.reviewTitle && (
            <div className={`text-st font-semibold text-white ${font}`}>
              {data.reviewTitle}
            </div>
          )}
          
          {/* 내용 */}
          <div className={`text-b2 text-white whitespace-pre-wrap ${font}`}>
            {data?.reviewContent || ""}
          </div>
          
          {/* 하단: 작성자, 날짜, 좋아요 */}
          <div className="flex justify-between items-center text-btn4 text-white mt-2">
            <div className="flex items-center gap-1">
              <span>{nickname}</span>
              <span>•</span>
              <span>{displayDate}</span>
            </div>
            <img
              className="cursor-pointer"
              src={heart_white}
              alt="heart"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubReviewCard;
