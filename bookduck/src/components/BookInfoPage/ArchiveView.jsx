import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyArchive } from "../../api/bookinfo";
import { getDetailExtractReview } from "../../api/archive";
import ReviewDetailCard from "../../components/RecordingPage/ReviewDetailCard";
import ExcerptDetailCard from "../../components/RecordingPage/ExcerptDetailCard";

const ArchiveView = ({ bookinfoId }) => {
  const [myArchiveData, setMyArchiveData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMyArchive({ bookinfoId });
        setMyArchiveData(res.userBookArchiveList);
      } catch (err) {
        console.error("오류 발생: ", err);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = async (archiveId) => {
    if (!archiveId) {
      return;
    }
    
    try {
      const res = await getDetailExtractReview(archiveId);
      
      if (!res) {
        return;
      }
      
      const typeState =
        res.excerpt && res.review ? "ALL" : res.excerpt ? "EXCERPT" : "REVIEW";

      if (typeState === "ALL")
        navigate(`/total-archive-detail/${archiveId}`, {
          state: { detailData: res },
        });
      else if (typeState === "REVIEW")
        navigate(`/review-archive-detail/${archiveId}`, {
          state: { detailData: res },
        });
      else if (typeState === "EXCERPT")
        navigate(`/excerpt-archive-detail/${archiveId}`, {
          state: { detailData: res },
        });
    } catch (error) {
      console.error("Failed to fetch archive detail:", error);
    }
  };


  return (
    <div className="flex flex-col justify-center items-center">
      {myArchiveData?.length > 0 ? (
        <div className="flex flex-col gap-4">
          {myArchiveData.map((item, index) => {
            const { type, data, archiveId } = item;
            if (type === "REVIEW") {
              return (
                <div key={index} onClick={() => handleCardClick(archiveId)} >
                  <ReviewDetailCard 
                    archiveDetailData={{ review: data }}
                    font=""
                  />
                </div>
              );
            } else if (type === "EXCERPT") {
              return (
                <div key={index} onClick={() => handleCardClick(archiveId)} >
                  <ExcerptDetailCard 
                    archiveDetailData={{ excerpt: data }}
                    font=""
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <div className="flex justify-center mt-[3.25rem] text-b2 text-gray-400">
          아직 작성된 독서기록이 없어요. <br />
          '독서 기록하기' 버튼을 눌러 책 구절을 <br />
          발췌하거나 감상평을 기록해 보세요!
        </div>
      )}
    </div>
  );
};
export default ArchiveView;
