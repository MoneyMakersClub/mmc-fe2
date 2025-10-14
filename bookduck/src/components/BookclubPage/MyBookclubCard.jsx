import { useNavigate } from "react-router-dom";
import BookclubPostInfo from "./BookclubPostInfo";

const MyBookclubCard = ({ club }) => {
  const navigate = useNavigate();

  const getStatusText = (status) => {
    switch (status) {
      case "BEFORE_START":
        return "시작 전";
      case "ACTIVE":
        return "읽는 중";
      case "FINISHED":
        return "종료";
      default:
        return "알 수 없음";
    }
  };

  const handleClubClick = () => {
    navigate(`/bookclub/${club.clubId}`);
  };

  return (
    <div 
      onClick={handleClubClick}
      className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow mb-3 active:bg-white"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* 책 이미지 */}
      <div className="w-[4.75rem] h-[7rem] mr-3 flex-shrink-0">
        <img 
          src={club.clubBookInfo?.bookImgPath} 
          alt={club.clubBookInfo?.bookTitle}
          className="w-full h-full object-cover rounded-[0.25rem]"
        />
      </div>

      {/* 북클럽 정보 */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* 상태 + 북클럽명 */}
          <div className="flex items-center gap-2 mb-2 pt-0">
            <span className="text-btn3 text-orange-400 bg-orange-50 px-2 py-1 rounded">
              [{getStatusText(club.clubStatus)}] {club.clubName}
            </span>
          </div>
          
          {/* 책 제목 */}
          <h3 className="text-b1 text-gray-800">
            {club.clubBookInfo?.bookTitle}
          </h3>
          
          {/* 작가 */}
          <p className="text-b2 text-gray-600">
            {club.clubBookInfo?.bookAuthor}
          </p>
        </div>

        {/* 안 읽은 메세지 수, 최근 온 메세지 */}
        <BookclubPostInfo 
          unreadCount={club.unreadCount} 
          latestPost={club.latestPost} 
        />
      </div>
    </div>
  );
};

export default MyBookclubCard;
