// 부모 컴포넌트에 아래 코드 추가하고 onClick={toggleAlarmModal}까지 props로 전달해주면 됩니다
// const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
// const toggleAlarmModal = () => {
//     setIsAlarmModalOpen(!isAlarmModalOpen);
//   };
// {isAlarmModalOpen && <CharacterAlarmModal onClick={toggleAlarmModal} />}

import { useEffect, useState } from "react";
import teacherDuck from "../../assets/common/teacher-duck.svg";
import Confetti from "react-confetti";
const CharacterAlarmModal = ({ type, badgeType, badgeName, text, onClick }) => {
  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [isRecycling, setIsRecycling] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRecycling(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[210]">
      <Confetti
        run={isConfettiActive}
        recycle={isRecycling}
        numberOfPieces={200}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div
        className={`relative ${
          type === "LEVEL" ? "h-[19.875rem]" : "h-[31.625rem]"
        } w-[20.625rem] `}
      >
        <img
          className="absolute left-[30%] z-[230] w-[7.375rem] h-[10.4375rem]"
          src={teacherDuck}
          alt="teacher duck"
        />
        <div className="absolute bottom-0 flex flex-col items-center bg-white w-[330px] rounded-[20px] z-[240]">
          <div className="flex flex-col py-4 gap-3 w-full">
            <div className="flex flex-col gap-3.5 pb-5">
              <div className="flex justify-center items-center text-t2 text-center font-semibold h-[3rem]">
                축하해요!
              </div>
              <div className="flex flex-col items-center px-7 gap-3">
                {type === "BADGE" && (
                  <img
                    className="w-[9.375rem] h-[9.375rem] "
                    src={`assets/characterPage/badges/${badgeType}/${badgeName}.png`}
                    alt={`${badgeName} badge`}
                  />
                )}
                <div className="text-b1">
                  {type === "LEVEL" ? (
                    <span>
                      북덕이 레벨 <span className="font-bold">{text}</span>로
                      레벨업했어요
                    </span>
                  ) : (
                    <p className="w-[14rem] text-center">{text}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 h-12 w-full">
              <button
                className="text-b1 font-semibold text-white bg-gray-700 p-2.5 w-[100%] h-12 rounded-lg"
                onClick={onClick}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterAlarmModal;
