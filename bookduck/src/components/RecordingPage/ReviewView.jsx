import { useQuery } from "@tanstack/react-query";
import { getExtractReview } from "../../api/archive";
import { getUserId } from "../../api/oauth";
import ReviewCard from "./ReviewCard";
import { useArchiveNavigation } from "../../hooks/useArchiveNavigation";

const ReviewView = ({ font }) => {
  const userId = getUserId();
  const { navigateToArchiveDetail } = useArchiveNavigation();
  
  const {
    data: archiveReviewData,
    isError,
    error,
  } = useQuery({
    queryKey: ["archiveReviewData"],
    queryFn: () => getExtractReview(userId, "REVIEW", 0, 20),
  });

  console.log("archiveReviewData:", archiveReviewData);

  return (
    <div className="flex flex-col gap-[1rem] items-center mt-[1rem]">
      {archiveReviewData?.archiveList?.length === 0 ? (
        <div className="mt-[17rem] text-gray-400">
          아직 작성된 감상평이 없어요!
        </div>
      ) : (
        archiveReviewData?.archiveList?.map((it, index) => (
          <ReviewCard
            key={index}
            reviewData={it}
            archive={true}
            font={font}
            onClick={() => navigateToArchiveDetail(it.archiveId)}
          />
        ))
      )}
    </div>
  );
};
export default ReviewView;
