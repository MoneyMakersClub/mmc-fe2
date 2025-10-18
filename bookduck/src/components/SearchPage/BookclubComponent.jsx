import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookclubComponent = ({ club, view = "list" }) => {
  const navigate = useNavigate();

  const getStatusText = (status) => {
    switch (status) {
      case "ACTIVE":
        return "진행 중";
      case "ENDED":
        return "종료";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BEFORE_START":
        return "bg-blue-100 text-blue-800";
      case "ACTIVE":
        return "bg-orange-100 text-orange-800";
      case "ENDED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleClubClick = () => {
    navigate(`/bookclub/${club.clubId}`);
  };

  if (view === "card") {
    return (
      <div 
        onClick={handleClubClick}
        className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-b2 font-semibold text-gray-800 line-clamp-2">
            {club.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(club.status)}`}>
            {getStatusText(club.status)}
          </span>
        </div>
        
        <p className="text-c1 text-gray-600 line-clamp-2 mb-3">
          {club.description}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>멤버 {club.memberCount}명</span>
          <span>{new Date(club.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    );
  }

  // list view
  return (
    <div 
      onClick={handleClubClick}
      className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-b1 font-semibold text-gray-800">
            {club.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(club.status)}`}>
            {getStatusText(club.status)}
          </span>
        </div>
        
        <p className="text-b2 text-gray-600 line-clamp-1 mb-2">
          {club.description}
        </p>
        
        <div className="flex justify-between items-center text-c1 text-gray-500">
          <span>멤버 {club.memberCount}명</span>
          <span>{new Date(club.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BookclubComponent;
