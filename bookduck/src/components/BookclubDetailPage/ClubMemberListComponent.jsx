import React from "react";
import { useNavigate } from "react-router-dom";
import profileDuck from "../../assets/common/profile-duck.svg";

const ClubMemberListComponent = ({
  memberId,
  userId,
  nickname,
  role,
  handleClick,
}) => {
  const navigate = useNavigate();

  console.log("ClubMemberListComponent - role:", role, "nickname:", nickname);

  const handleMemberClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      navigate(`/user/${userId}`);
    }
  };

  return (
    <div
      className="flex justify-between items-center px-4 py-[0.5rem] cursor-pointer"
      onClick={handleMemberClick}
    >
      <div className="flex items-center">
        <div className="w-[3.5rem] h-[3.5rem] mr-3 rounded-full overflow-hidden bg-stone-50 border border-gray-200 flex items-center justify-center" style={{ borderWidth: '0.1px' }}>
          <img src={profileDuck} className="w-[2.5rem] h-[2.5rem] object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="ml-2 text-gray-800">{nickname}</span>
          <span className="ml-2 text-xs text-gray-500">
            {role === "LEADER" ? "리더" : "멤버"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClubMemberListComponent;
