import React, { Suspense, lazy } from "react";
import duck from "../../assets/common/duck.svg";
import ButtonComponent from "./ButtonComponent";
import badge from "../../assets/friendPage/badge.svg";

// UserDuck 컴포넌트를 동적으로 임포트
const UserDuck = lazy(() => import("../../components/CharacterPage/UserDuck"));

const FriendListComponent = ({
  image,
  userName,
  userId,
  text,
  isOfficial,
  handleClick,
  handleDelete,
  handleCancel,
  handleDecline,
  handleAccept,
}) => {
  // 텍스트 조건 처리 함수
  const renderActionButton = () => {
    switch (text) {
      case "삭제":
        return (
          <button
            onClick={handleDelete}
            className="text-btn3 text-[#FFBF68] px-3 py-1"
          >
            삭제
          </button>
        );
      case "취소":
        return (
          <button
            onClick={handleCancel}
            className="text-btn3 text-gray-400 px-3 py-1"
          >
            취소
          </button>
        );
      case "친구":
        return <span className="text-blue-400 text-b2">친구</span>;
      case "none":
      default:
        return null;
    }
  };

  // 버튼 그룹 컴포넌트
  const renderButtons = () => (
    <div className="flex gap-2.5">
      <ButtonComponent
        type="secondary"
        text="거절"
        color="gray"
        size="small"
        onClick={handleDecline}
      />
      <ButtonComponent
        type="secondary"
        text="수락"
        color="orange"
        size="small"
        onClick={handleAccept}
      />
    </div>
  );

  return (
    <div
      className="flex justify-between items-center px-4 py-[0.5rem] cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="w-[3.5rem] h-[3.5rem] mr-3">
          <img src={duck} className="object-cover w-full h-full" />
        </div>
        <span className="ml-2 text-gray-800">{userName}</span>
        {isOfficial && (
          <img src={badge} className="ml-1 w-5 h-5" alt="Official Badge" />
        )}
      </div>
      <div>{text ? renderActionButton() : renderButtons()}</div>
    </div>
  );
};

export default FriendListComponent;
