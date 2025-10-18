import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getClubArchives } from "../../api/bookclub";
import { getDetailExtractReview } from "../../api/archive";
import ClubReviewCard from "./ClubReviewCard";
import ClubExcerptCard from "./ClubExcerptCard";
import bookDuckSvg from "../../assets/bookclubPage/book-duck.svg";

const ClubArchiveView = ({ clubId, unreadCount = 0, activeFilter, members = [] }) => {
  const [archiveData, setArchiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 멤버 필터링 로직
        let memberId = null;
        if (activeFilter && activeFilter !== "전체") {
          const selectedMember = members.find(member => member.nickname === activeFilter);
          if (selectedMember) {
            memberId = selectedMember.memberId;
          }
        }
        
        const res = await getClubArchives(clubId, memberId);
        setArchiveData(res.archives?.pageContent || []);
      } catch (err) {
        console.error("북클럽 기록 조회 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (clubId) {
      fetchData();
    }
  }, [clubId, activeFilter, members]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">기록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      {archiveData?.length > 0 ? (
        <div className="flex flex-col gap-4 w-full">
          {archiveData.map((item, index) => {
            const { type, id, nickname, data } = item;

            if (type === "REVIEW") {
              return (
                <div key={index}>
                  <ClubReviewCard 
                    data={data}
                    font=""
                    nickname={nickname}
                  />
                </div>
              );
            } else if (type === "EXCERPT") {
              return (
                <div key={index}>
                  <ClubExcerptCard 
                    data={data}
                    nickname={nickname}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full py-16">
          <img src={bookDuckSvg} alt="book-duck" className="w-[4.3125rem] h-[6.3125rem] mb-4" />
          <div 
            className="text-b2 text-gray-400 text-center"
            dangerouslySetInnerHTML={{
              __html: "북클럽에 남겨진 독서 기록이 없어요. <br> 기록하기 버튼을 눌러 기록을 시작해주세요!"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ClubArchiveView;
