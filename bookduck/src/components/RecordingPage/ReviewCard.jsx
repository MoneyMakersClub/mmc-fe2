const ReviewCard = ({ reviewData, archive = false, font, onClick }) => {
  // 데이터 유효성 체크
  if (!reviewData) {
    return null;
  }

  const archiveId = reviewData.archiveId;
  const content = reviewData?.data?.reviewContent;
  const reviewId = reviewData?.data?.reviewId;
  const reviewTitle = reviewData?.data?.reviewTitle;
  const title = reviewData?.title;
  const author = reviewData?.author;
  const color = reviewData?.data?.color;
    
  return (
    <div onClick={onClick} className={`w-full ${onClick ? 'cursor-pointer' : ''}`}>
      <div
        className="flex flex-col gap-[1.75rem] w-full p-[1.25rem] rounded-[0.88rem] shadow-custom"
        style={{ backgroundColor: color || "#ABABAB" }}
      >
        <div className="flex flex-col gap-[0.25rem]">
          <div className={`text-st text-white font-semibold ${font}`}>
            {reviewTitle}
          </div>
          <div className={`text-b2 text-white ${font}`}>{content}</div>
        </div>
        <div className={`text-c1 text-white/60 ${font}`}>
          {title && author && `${title} / ${author}`}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;

