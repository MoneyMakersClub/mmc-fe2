import { useNavigate } from "react-router-dom";
import lock from "../../assets/mainPage/lock.svg";
import heart_gray from "../../assets/recordingPage/heart-gray.svg";

const ClubExcerptCard = ({ data, nickname }) => {
  const navigate = useNavigate();
  
  // 날짜 포맷
  const formattedDate = (date) => {
    if (!date) return "";
    return date.split("T")[0].replace(/-/g, ".");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 rounded-2xl bg-gray-10 shadow-custom p-5">
        {/* 나만보기 아이콘 및 페이지 정보 */}
        <div
          className={`flex ${
            data?.visibility === "PRIVATE" ? "justify-between" : "justify-end"
          } items-center text-b2 text-gray-400`}
        >
          {data?.visibility === "PRIVATE" && (
            <div className="flex items-center gap-1">
              <img src={lock} alt="lock" />
              <span className="text-btn4">나만보기</span>
            </div>
          )}
          {data?.pageNumber > 0 && (
            <div>{data?.pageNumber}p</div>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="flex flex-col gap-2">
          <div className="text-b2 text-gray-800 whitespace-pre-wrap">
            {data?.excerptContent || ""}
          </div>
          
          {/* 하단: 작성자, 날짜, 좋아요 */}
          <div className="flex justify-between items-center text-btn4 text-gray-500">
            <div className="flex items-center gap-1">
              <span>{nickname}</span>
              <span>•</span>
              <span>{formattedDate(data?.createdTime)}</span>
            </div>
            <img
              className="cursor-pointer"
              src={heart_gray}
              alt="heart"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubExcerptCard;

