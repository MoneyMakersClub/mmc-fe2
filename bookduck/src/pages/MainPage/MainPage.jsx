import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { get } from "../../api/example";
import { getUserId } from "../../api/oauth";
import BottomNavbar from "../../components/common/BottomNavbar";
import MainHeader from "../../components/common/MainHeader";
import ReadingSpaceComponent from "../../components/MainPage/ReadingSpaceComponent";
import right from "../../assets/common/right-yellow.svg";
import BookCountDisplay from "../../components/MainPage/BookCountDisplay";
import DeleteModal from "../../components/common/modal/DeleteModal";
import { useSSE } from "../../context/SSEProvider";
import FullModal from "../../components/MainPage/FullModal";
import FloatingRecordButton from "../../components/common/FloatingRecordButton";
import UserDuck from "../../components/CharacterPage/UserDuck";
// API 호출 함수
const getUserInfo = async (userId) => {
  return await get(`/users/${userId}`);
};

const MainPage = () => {
  const navigate = useNavigate();
  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState("bg-gray-50");
  const [isNavBar, setIsNavBar] = useState(true); // boolean으로 변경
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOutModal, setShowOutModal] = useState(false);
  const [showFullModal, setShowFullModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAllDelete, setIsAllDelete] = useState(false);
  const [isFloatingVisible, setIsFloatingVisible] = useState(true);
  const [isDot, setIsDot] = useState(false);
  const { sseData } = useSSE();

  const userId = getUserId();

  // React Query - 유저 정보 가져오기
  const userInfoQuery = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserInfo(userId),
    onSuccess: (data) => console.log("유저 정보 로드 성공:", data),
    onError: (error) => console.error("유저 정보 로드 실패:", error),
  });
  const userInfo = userInfoQuery.data;
  // 모달 핸들러
  const handleOutModal = () => {
    setIsEditMode(false);
    setShowOutModal(false);
  };

  const handleFullModal = () => {
    setShowFullModal(false);
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    setIsAllDelete(true);
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
    }, 200);
  };
  // 로딩 처리
  if (userInfoQuery.isLoading) {
    return <div>로딩 중...</div>;
  }

  // SSE 데이터에 따라 Dot 상태 업데이트
  useEffect(() => {
    // console.log("SSE 데이터 업데이트 감지:", sseData);
    const shouldShowDot =
      sseData?.isCommonAlarmChecked === false ||
      sseData?.isAnnouncementChecked === false;

    if (isDot !== shouldShowDot) {
      setIsDot(shouldShowDot);
    }
  }, [sseData, isDot]);

  useEffect(() => {
    const firstLogin = JSON.parse(localStorage.getItem("isFirstLogin"));
    if (!firstLogin) {
      localStorage.setItem("isFirstLogin", JSON.stringify(true));
    }
  });

  return (
    <div className={`${color} w-full relative overflow-hidden h-screen`}>
      <div className="px-4">
        <MainHeader isDot={isDot} />
      </div>
      <div className="pl-5 mt-[1.75rem] w-full">
        <div className="text-t2 font-semibold text-black">
          {userInfo?.nickname}님
        </div>
        <div className="text-t2 font-semibold text-black mt-[0.38rem]">
          꾸준한 독서 함께해요!
        </div>
        <div className="flex w-full flex-row relative">
          <div>
            <div
              className="flex flex-col w-[10.625rem] h-[6rem] bg-white rounded-[0.75rem] mt-[2.69rem] pl-4 pr-5 pt-3 gap-2"
              style={{
                boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.10)",
              }}
            >
              <span className="text-b2 text-gray-800 font-semibold">
                현재 나의 기록수
              </span>
              <div className="flex flex-row">
                <BookCountDisplay bookCount={userInfo?.bookCount || 0} />
                <div className="ml-[0.62rem] self-end text-b2 text-gray-500 font-semibold">
                  개
                </div>
              </div>
            </div>
            <button
              className="w-[10.5625rem]"
              onClick={() => navigate(`/statistics/${userId}`)}
            >
              <div
                className="flex justify-center items-center gap-[0.38rem] w-[10.625rem] h-[2.625rem] bg-white rounded-[0.625rem] mt-[0.81rem]"
                style={{
                  boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.10)",
                }}
              >
                <span className="text-b2 text-gray-800 font-semibold">
                  독서 리포트 보러가기
                </span>
                <img src={right} alt="arrow" />
              </div>
            </button>
          </div>
          <div className="absolute left-40 top-10 w-[12.6875rem] h-[12.9375rem]">
            <UserDuck userId={userId} />
          </div>
        </div>

        <ReadingSpaceComponent
          setColor={setColor}
          setIsNavBar={setIsNavBar}
          setShowDeleteModal={setShowDeleteModal}
          setShowOutModal={setShowOutModal}
          setShowFullModal={setShowFullModal}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          isAllDelete={isAllDelete}
          visible={visible}
          setVisible={setVisible}
          bottomSheetShow={bottomSheetShow}
          setBottomSheetShow={setBottomSheetShow}
          setIsAllDelete={setIsAllDelete}
          setIsFloatingVisible={setIsFloatingVisible}
        />
        {isFloatingVisible && (
          <div className="absolute right-0  bottom-24 z-50">
            <FloatingRecordButton
              text={!JSON.parse(localStorage.getItem("isFirstLogin"))}
              handleNavigate={() => navigate("/selectbook")}
            />
          </div>
        )}
      </div>
      {isNavBar && <BottomNavbar />}
      {showDeleteModal && (
        <DeleteModal
          title="정말 삭제하시겠어요?"
          content="카드들이 모두 삭제되며 복구할 수 없어요."
          leftBtnText="삭제"
          rightBtnText="취소"
          onLeftClick={handleDelete}
          onRightClick={() => setShowDeleteModal(false)}
        />
      )}
      {showOutModal && (
        <DeleteModal
          title={`편집된 사항을\n저장하지 않고 나갈까요?`}
          leftBtnText="나가기"
          rightBtnText="계속하기"
          onLeftClick={handleOutModal}
          onRightClick={() => setShowOutModal(false)}
        />
      )}
      {showFullModal && <FullModal onClick={handleFullModal} />}
    </div>
  );
};

export default MainPage;
