import { useQuery } from "@tanstack/react-query";
import { getExtractReview } from "../../api/archive";
import { getUserId } from "../../api/oauth";
import ExcerptCard from "./ExcerptCard";
import { useArchiveNavigation } from "../../hooks/useArchiveNavigation";

const ExcerptView = ({ font }) => {
  const userId = getUserId();
  const { navigateToArchiveDetail } = useArchiveNavigation();
  
  const {
    data: archiveExcerptData,
    isError,
    error,
  } = useQuery({
    queryKey: ["archiveExcerptData"],
    queryFn: () => getExtractReview(userId, "EXCERPT", 0, 20),
  });

  console.log("archiveExcerptData:", archiveExcerptData);

  return (
    <div className="flex flex-col gap-[1rem] items-center mt-[1rem]">
      {archiveExcerptData?.archiveList?.length === 0 ? (
        <div className="mt-[17rem] text-gray-400">
          아직 작성된 발췌 기록이 없어요!
        </div>
      ) : (
        archiveExcerptData?.archiveList?.map((it, index) => (
          <ExcerptCard
            key={index}
            excerptData={it}
            archive={true}
            font={font}
            onClick={() => navigateToArchiveDetail(it.archiveId)}
          />
        ))
      )}
    </div>
  );
};
export default ExcerptView;
