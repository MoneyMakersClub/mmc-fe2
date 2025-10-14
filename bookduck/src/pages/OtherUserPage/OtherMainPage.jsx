import React, { useState } from "react";
import Header from "../../components/OtherUserPage/Header";
import { get, post, del } from "../../api/example";
import { useNavigate } from "react-router-dom";
import ReadingSpaceComponent from "../../components/MainPage/ReadingSpaceComponent";
import BookCountDisplay from "../../components/MainPage/BookCountDisplay";
import right from "../../assets/common/right-yellow.svg";
import UserDuck from "../../components/CharacterPage/UserDuck";
import StopModal from "../../components/OtherUserPage/StopModal";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
// API 호출 함수
const getUserInfo = async (userId) => {
  return await get(`/users/${userId}`);
};

//친구요청
const postFriendRequest = async (userId) => {
  return await post(`/friendrequests`, {
    receiverId: userId,
  });
};

//친구요청취소
const delFriendRequest = async (friendRequestId) => {
  return await del(`/friendrequests/${friendRequestId}`);
};

//친구삭제
const delFriend = async (friendId) => {
  return await del(`/friends/${friendId}`);
};

//친구요청수락
const postFriendAccept = async (friendRequestId) => {
  return await post(`/friends`, {
    friendRequestId: friendRequestId,
  });
};

const OtherMainPage = () => {
  const navigate = useNavigate();
  const [isStopModal, setIsStopModal] = useState(false);
  let { id: userId } = useParams();

  const userInfoQuery = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => getUserInfo(userId),
    onSuccess: () => {
      console.log("유저 정보 조회 성공");
    },
    onError: (error) => console.error("유저 정보 조회 실패", error),
  });
  const userInfo = userInfoQuery.data;

  const postFriendRequestQuery = useMutation({
    mutationFn: postFriendRequest,
    onSuccess: () => {
      console.log("친구 요청 성공");
      userInfoQuery.refetch();
    },
    onError: (error) => console.error("친구요청 실패", error),
  });

  const delFriendRequestQuery = useMutation({
    mutationFn: delFriendRequest,
    onSuccess: () => {
      console.log("친구요청 취소 성공");
      userInfoQuery.refetch();
    },
    onError: (error) => console.error("친구요청 취소 실패", error),
  });

  const delFriendQuery = useMutation({
    mutationFn: delFriend,
    onSuccess: () => {
      console.log("친구 삭제 성공");
      userInfoQuery.refetch();
    },
    onError: (error) => console.error("친구삭제 실패", error),
  });

  const postFriendAcceptQuery = useMutation({
    mutationFn: postFriendAccept,
    onSuccess: () => {
      console.log("친구 수락 성공");
      userInfoQuery.refetch();
    },
    onError: (error) => console.error("친구수락 실패", error),
  });

  const handleReportClick = () => {
    if (userInfo.userRelationshipStatus === "FRIEND") {
      navigate(`/statistics/${userId}`);
    } else {
      setIsStopModal(true);
    }
  };

  return (
    <div className="bg-gray-50 overflow-hidden h-screen">
      <Header
        userRelationshipStatus={userInfo?.userRelationshipStatus}
        handleAddClick={() => postFriendRequestQuery.mutate(userId)}
        handleDelFriendClick={() => delFriendQuery.mutate(userInfo?.friendId)}
        handleDelRequestClick={() =>
          delFriendRequestQuery.mutate(userInfo?.friendRequestId || null)
        }
        handleAcceptClick={() =>
          postFriendAcceptQuery.mutate(userInfo?.friendRequestId || null)
        }
      />
      <div className="pl-5 mt-[1.75rem]">
        <div className="text-t2 font-semibold text-black">
          {userInfo?.nickname}님의
        </div>
        <div className="text-t2 font-semibold text-black mt-[0.38rem]">
          홈에 오신 걸 환영해요!
        </div>
        <div className="flex flex-row relative">
          <div>
            <div className="flex flex-col w-[10.625rem] h-[6rem] bg-white rounded-[0.75rem] mt-[2.69rem] pl-4 pr-5 pt-3 gap-2">
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
            <button className="w-[10.5625rem]" onClick={handleReportClick}>
              <div className="flex justify-center items-center gap-1.5 w-[10.625rem] h-[2.625rem] bg-white rounded-xl mt-[0.81rem]">
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
        <ReadingSpaceComponent isMine={false} otherUserId={userId} />
      </div>
      {isStopModal && <StopModal onClick={() => setIsStopModal(false)} />}
    </div>
  );
};

export default OtherMainPage;
