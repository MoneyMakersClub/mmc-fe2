import { useQuery } from "@tanstack/react-query";
import ExcerptCard from "./ExcerptCard";
import ReviewCard from "./ReviewCard";
import { getExtractReview } from "../../api/archive";
import { getUserId } from "../../api/oauth";
import { useArchiveNavigation } from "../../hooks/useArchiveNavigation";

const TotalView = ({ font }) => {
  const userId = getUserId();
  const { navigateToArchiveDetail } = useArchiveNavigation();
  
  const {
    data: archiveData,
    isError,
    error,
  } = useQuery({
    queryKey: ["archiveData"],
    queryFn: () => getExtractReview(userId, "ALL", 0, 20),
  });
  
  return (
    <div className="w-full flex flex-col gap-4 items-center mt-[1rem]">
      {archiveData?.archiveList?.length === 0 ? (
        <div className="mt-[17rem] text-gray-400">
          아직 작성된 기록이 없어요!
        </div>
      ) : (
        archiveData?.archiveList?.map((it, index) => (
          it.type === "EXCERPT" ? (
            <ExcerptCard
              key={index}
              excerptData={it}
              archive={true}
              font={font}
              onClick={() => navigateToArchiveDetail(it.archiveId)}
            />
          ) : (
            <ReviewCard
              key={index}
              reviewData={it}
              archive={true}
              font={font}
              onClick={() => navigateToArchiveDetail(it.archiveId)}
            />
          )
        ))
      )}
    </div>
  );
};
export default TotalView;
