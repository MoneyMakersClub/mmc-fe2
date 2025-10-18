import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import TabBarComponent from "../../components/common/TabBarComponent";
import RoundedTabComponent from "../../components/common/RoundedTabComponent";
import BookInfoCard from "../../components/BookclubDetailPage/BookInfoCard";
import ClubArchiveView from "../../components/BookclubDetailPage/ClubArchiveView";
import ClubMemberView from "../../components/BookclubDetailPage/ClubMemberView";
import FloatingRecordButton from "../../components/common/FloatingRecordButton";
import useBookInfoStore from "../../store/useBookInfoStore";
import { getClubDetail } from "../../api/bookclub";
import SuspenseLoading from "../../components/common/SuspenseLoading";

const BookClubDetailPage = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setBookInfo } = useBookInfoStore();
  
  const [activeTab, setActiveTab] = useState("북클럽");
  const [activeFilter, setActiveFilter] = useState("전체");
  const [clubData, setClubData] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const clubRes = await getClubDetail(clubId);
      setClubData(clubRes);
      
      // 실제 멤버 목록 사용
      if (clubRes?.members) {
        setMembers(clubRes.members);
      }
    } catch (error) {
      console.error("북클럽 상세 정보 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clubId]);

  const handleBack = () => {
    navigate('/bookclub'); 
  };

  const handleBookClick = () => {
    if (clubData?.clubBookInfo) {
      const { bookInfoId, isCustom } = clubData.clubBookInfo;
      if (isCustom) {
        navigate(`/info/book/custom/${bookInfoId}`);
      } else {
        navigate(`/info/book/${bookInfoId}`);
      }
    }
  };


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


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SuspenseLoading />
      </div>
    );
  }

  if (!clubData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">북클럽 정보를 불러올 수 없습니다.</div>
      </div>
    );
  }


  return (
    <div className="w-full">
      <NavigationHeader 
        title={clubData.clubName} 
        handleBack={handleBack}
        menu={true}
      />
      
      <div className="pt-[calc(env(safe-area-inset-top)+2.75rem)]">
        {/* 상태와 날짜 */}
        <div className="py-3">
          <div className="bg-orange-50 px-4 py-2 mx-4 rounded-lg flex items-center gap-3">
            <div className="text-b2 text-orange-400 font-semibold">
              [{getStatusText(clubData.clubStatus)}]
            </div>
            <div className="text-b2 text-gray-500">
              {formatDate(clubData.activeStartDate)} ~ {formatDate(clubData.activeEndDate)}
            </div>
          </div>
        </div>
        
        {/* 책 정보 카드 */}
        <div className="px-4">
          <BookInfoCard 
            clubData={clubData} 
            getStatusText={getStatusText}
            formatDate={formatDate}
            onRefresh={fetchData}
            onBookClick={handleBookClick}
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-4 py-2">
          <TabBarComponent
            tabs={["북클럽", `참여자 (${clubData.memberCount}명)`, "모임 정보"]}
            activeTab={activeTab}
            onTabClick={setActiveTab}
            size=""
          />
        </div>

        {/* 탭 내용 */}
        {activeTab === "북클럽" && (
          <div className="px-4">
            {/* 필터 */}
            <div className="py-3">
              <RoundedTabComponent
                type="secondary"
                tabs={["전체", ...members.map(member => member.nickname)]}
                activeTab={activeFilter}
                onTabClick={setActiveFilter}
                multiple={false}
              />
            </div>

            {/* 기록 목록 */}
            <div className="pb-20">
              <ClubArchiveView 
                clubId={clubId} 
                unreadCount={clubData?.unreadCount || 0} 
                activeFilter={activeFilter}
                members={members}
              />
            </div>
          </div>
        )}

        {activeTab === "참여자" && (
          <div className="py-4">
            <ClubMemberView clubId={clubId} />
          </div>
        )}

        {activeTab === "모임 정보" && (
          <div className="px-4 py-8">
            <div className="text-center text-gray-500">
            공사중..
            </div>
          </div>
        )}

        {/* 플로팅 액션 버튼 */}
        {clubData.isMember && (
          <div className="fixed bottom-[2.625rem] right-4 z-50">
            <FloatingRecordButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookClubDetailPage;


