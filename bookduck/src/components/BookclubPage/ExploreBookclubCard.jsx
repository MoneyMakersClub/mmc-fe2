import { useNavigate } from "react-router-dom";

const ExploreBookclubCard = ({ club }) => {
  const navigate = useNavigate();

  const getStatusText = (status) => {
    switch (status) {
      case "RECRUITING":
        return "모집 중";
      case "IN_PROGRESS":
        return "진행 중";
      case "FINISHED":
        return "종료";
      default:
        return "모집 중";
    }
  };

  const handleClubClick = () => {
    navigate(`/bookclub/${club.clubId}`);
  };

  return (
    <div 
      onClick={handleClubClick}
      className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow mb-3"
    >
      {/* 책 이미지 */}
      <div className="w-[4.75rem] h-[7rem] mr-3 flex-shrink-0">
        <img 
          src={club.bookCover} 
          alt={club.bookTitle}
          className="w-full h-full object-cover rounded-[0.25rem]"
        />
      </div>

      {/* 북클럽 정보 */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* 상태 + 북클럽명 */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-btn3 text-orange-400 bg-orange-50 px-2 py-1 rounded">
              [{getStatusText(club.status)}] {club.name}
            </span>
          </div>
          
          {/* 책 제목 */}
          <h3 className="text-b1 font-semibold text-gray-800 mb-1">
            {club.bookTitle}
          </h3>
          
          {/* 작가 */}
          <p className="text-b2 text-gray-600 mb-2">
            {club.author}
          </p>
          
          {/* 멤버 수 + 기간 */}
          <div className="flex items-center gap-2">
            <span className="text-c1 text-gray-600">
              {club.memberCount}명 • {club.startDate}~{club.endDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreBookclubCard;
