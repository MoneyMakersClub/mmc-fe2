import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import RecordCalender from "../../components/StatisticsPage/RecordCalender";
import Divider2 from "../../components/common/Divider2";
import MyKeyword from "../../components/StatisticsPage/MyKeyword";
import SummaryFloatingButton from "../../components/StatisticsPage/SummaryFloatingButton";
import PreferredAuthor from "../../components/StatisticsPage/PreferredAuthor";
import PreferredGenre from "../../components/StatisticsPage/PreferredGenre";
import MonthlyReading from "../../components/StatisticsPage/MonthlyReading";
import UserCard from "../../components/StatisticsPage/UserCard";
import { getUserStatisticsInfo, getKeywords } from "../../api/statistics";
import { getUserId } from "../../api/oauth";

const StatisticsPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMyPage, setIsMyPage] = useState(false);
  const [hasKeywords, setHasKeywords] = useState(false);

  const genreToKorean = {
    FICTION: "소설",
    LITERARY: "시/에세이",
    BUSINESS: "경제/경영",
    SELF_HELP: "자기계발",
    SCIENCE: "과학",
    SOCIETY: "정치/사회",
    LANGUAGE: "언어",
    TRAVEL: "여행",
    HISTORY: "역사",
    COMPUTER: "컴퓨터/IT",
    HEALTH: "건강/스포츠",
    HOBBY: "취미/실용",
    ART: "예술",
    RELIGION: "종교",
    COMICS: "만화",
    HOME_COOKING: "가정/요리",
    ARCHITECTURE: "건축",
    REFERENCE: "교재/참고서",
    TECHNOLOGY: "기술/공학",
    HUMANITIES: "인문",
    YOUTH: "아동/청소년",
    OTHERS: "기타",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUserStatisticsInfo(userId);
        setUserData(res);
      } catch (err) {
        console.error("유저 데이터 로딩 오류: ", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchKeywords = async () => {
      try {
        const keywords = await getKeywords(userId);
        setHasKeywords(Array.isArray(keywords) && keywords.length > 0);
      } catch (err) {
        console.error("키워드 로딩 오류: ", err);
        setHasKeywords(false);
      }
    };

    fetchUserData();
    fetchKeywords();
  }, [userId]);

  useEffect(() => {
    const checkIsMyPage = async () => {
      const myUserId = await getUserId();
      setIsMyPage(String(myUserId) === String(userId));
    };
    checkIsMyPage();
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-10"></div>;
  }
  return (
    <div className="flex flex-col pb-[11.25rem]">
      <NavigationHeader title="독서 리포트" />
      <UserCard
        nickname={userData?.nickname}
        userId={userId}
        duckTitle={userData?.duckTitle}
        genreToKorean={genreToKorean}
      />
      <div className="flex flex-col pt-6 px-7 pb-7 gap-7 bg-gray-50">
        <div className="text-b1 font-semibold">
          {userData?.isFirstHalf ? "상반기" : "하반기"} 기록은 총{" "}
          <span className="text-blue-800">
            {userData?.excerptCount + userData?.bookRecordCount}
          </span>
          개!
        </div>
        <div className="flex justify-between items-center">
          <RecordCalender num={userData?.excerptCount} text="발췌" />
          <RecordCalender num={userData?.bookRecordCount} text="감상평" />
          <RecordCalender
            num={userData?.finishedBookCount}
            text="다 읽은 책"
            big={true}
          />
        </div>
      </div>
      <MonthlyReading userData={userData} />
      <PreferredGenre
        userData={userData?.mostReadGenres?.map((genre) => ({
          ...genre,
          genreName: genreToKorean[genre.genreName] || genre.genreName,
        }))}
      />
      <Divider2 />
      {/* 같은 작가의 작품을 최소 2권 이상을 읽어야 ‘선호하는 작가' 카드가 보임 */}
      <PreferredAuthor
        author={userData?.mostReadAuthor}
        imgPath={userData?.imgPaths}
      />
      <Divider2 />
      <MyKeyword />
      <div className="flex justify-center text-center mt-[3.75rem] text-b2 text-gray-400">
        북덕은 언제나 {userData?.nickname}님의
        <br />
        독서를 응원합니다!
      </div>
      <div className="flex justify-center">
        {isMyPage && hasKeywords && <SummaryFloatingButton />}
      </div>
    </div>
  );
};
export default StatisticsPage;
