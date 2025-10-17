import { useNavigate } from "react-router-dom";

const MyBookclubCard = ({ club }) => {
  const navigate = useNavigate();

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "읽는 중";
      case "ENDED":
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
      className="relative flex bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow mb-3 active:bg-white"
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
      <div className="flex-1 flex flex-col justify-between h-[7rem]">
        <div className="flex flex-col h-full">
          {/* 상태 + 북클럽명 */}
          <div className="flex items-start gap-2 mb-1">
            <span className="text-b2 text-orange-400 bg-orange-50 px-2 py-0.5 rounded">
              [{getStatusText(club.clubStatus)}] {club.clubName}
            </span>
          </div>
          
          {/* 책 제목 (한 줄 제한) */}
          <h3 className="text-b1 text-gray-800 line-clamp-1 mb-1 flex-shrink-0">
            {club.clubBookInfo?.bookTitle}
          </h3>
          
          {/* 작가 */}
          <p className="text-b2 text-gray-500 mb-2 flex-shrink-0">
            {club.clubBookInfo?.bookAuthor}
          </p>
          
          {/* 최근 메시지 */}
          <div className="mt-auto flex-shrink-0 flex items-end">
            {club.latestPost?.content ? (
              <div className="w-[14.6875rem] h-[1.875rem] bg-gray-50 rounded px-2 flex items-center">
                <span className="text-b2 text-gray-600 truncate">
                  {club.latestPost.content}
                </span>
              </div>
            ) : (
              <div className="w-[14.6875rem] h-[1.875rem]"></div>
            )}
          </div>
        </div>

        {/* 안 읽은 메세지 수 */}
        {club.unreadCount > 0 && (
          <div className="absolute top-4 right-4 w-5 h-5 bg-orange-300 rounded-full flex items-center justify-center">
            <span className="text-c1 text-white font-semibold">{club.unreadCount}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookclubCard;
