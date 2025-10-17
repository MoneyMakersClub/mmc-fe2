import { useNavigate } from "react-router-dom";
import lock from "../../assets/mainPage/lock.svg";

const ClubExcerptCard = ({ archiveDetailData, nickname, createdTime }) => {
  const navigate = useNavigate();
  
  const excerpt = archiveDetailData?.excerpt;
  
  // 날짜 포맷
  const formattedDate = createdTime?.split("T")[0].replace(/-/g, ".");

  const handleUserClick = () => {
    // userId가 있다면 navigate
    // 추후 userId 전달 시 구현
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 rounded-2xl bg-gray-10 shadow-custom p-5">
        {/* 상단: 나만보기 아이콘 및 페이지 정보 */}
        <div
          className={`flex ${
            excerpt?.visibility === "PRIVATE" ? "justify-between" : "justify-end"
          } items-center text-b2 text-gray-400`}
        >
          {excerpt?.visibility === "PRIVATE" && (
            <div className="flex items-center gap-1">
              <img src={lock} alt="lock" />
              <span className="text-btn4">나만보기</span>
            </div>
          )}
          {excerpt?.pageNumber > 0 && (
            <div>{excerpt?.pageNumber}p</div>
          )}
        </div>

        {/* 본문 내용 */}
        <div className="flex flex-col gap-2">
          <div className="text-b2 text-gray-800 whitespace-pre-wrap">
            {excerpt?.excerptContent || ""}
          </div>
          
          {/* 하단: 작성자 및 날짜 정보 */}
          <div className="flex justify-between items-center text-btn4 text-gray-500">
            <span className="underline cursor-pointer" onClick={handleUserClick}>
              {nickname}
            </span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubExcerptCard;

