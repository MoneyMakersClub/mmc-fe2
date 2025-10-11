const BookclubPostInfo = ({ unreadCount, latestPost }) => {
  return (
    <div className="flex justify-between items-center mt-2">
      {/* 최근 기록 */}
      {latestPost && (
        <div className="flex-1 mr-2">
          <p className="text-c1 text-gray-600 line-clamp-1">
            {latestPost.content}
          </p>
        </div>
      )}
      
      {/* 안 읽은 기록 수 */}
      {unreadCount > 0 && (
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-c1 font-semibold">
            {unreadCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default BookclubPostInfo;
