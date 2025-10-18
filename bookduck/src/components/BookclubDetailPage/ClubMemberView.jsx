import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClubMembers } from "../../api/bookclub";
import FriendListComponent from "../common/FriendListComponent";

const ClubMemberView = ({ clubId }) => {
  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const res = await getClubMembers(clubId);
        setMemberData(res);
      } catch (err) {
        console.error("멤버 목록 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (clubId) {
      fetchMembers();
    }
  }, [clubId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">멤버를 불러오는 중...</div>
      </div>
    );
  }

  const members = memberData?.members || [];

  return (
    <div className="flex flex-col">
      {members.length > 0 ? (
        <div className="flex flex-col">
          {members.map((member, index) => (
            <FriendListComponent
              key={member.memberId}
              userId={member.userId}
              userName={member.nickname}
              isOfficial={member.role === "LEADER"}
              text="none"
              handleClick={() => navigate(`/user/${member.userId}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-16">
          <div className="text-b2 text-gray-400">멤버가 없습니다.</div>
        </div>
      )}
    </div>
  );
};

export default ClubMemberView;

