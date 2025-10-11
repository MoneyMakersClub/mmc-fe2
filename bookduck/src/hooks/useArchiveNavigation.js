import { useNavigate } from "react-router-dom";
import { getDetailExtractReview } from "../api/archive";

export const useArchiveNavigation = () => {
  const navigate = useNavigate();

  const navigateToArchiveDetail = async (archiveId) => {
    try {
      const res = await getDetailExtractReview(archiveId);
      const typeState =
        res.excerpt && res.review ? "ALL" : res.excerpt ? "EXCERPT" : "REVIEW";

      // detail로 이동 전 현재 경로 저장
      sessionStorage.setItem('previousPath', window.location.pathname);

      if (typeState === "ALL") {
        navigate(`/total-archive-detail/${archiveId}`, {
          state: { detailData: res },
        });
      } else if (typeState === "REVIEW") {
        navigate(`/review-archive-detail/${archiveId}`, {
          state: { detailData: res },
        });
      } else if (typeState === "EXCERPT") {
        navigate(`/excerpt-archive-detail/${archiveId}`, {
          state: { detailData: res },
        });
      }
    } catch (error) {
      console.error("Failed to fetch archive detail:", error);
    }
  };

  return { navigateToArchiveDetail };
};

