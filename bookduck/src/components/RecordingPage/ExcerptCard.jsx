const ExcerptCard = ({ excerptData, archive = false, font, onClick }) => {
  // 데이터 유효성 체크
  if (!excerptData) {
    return null;
  }

  const archiveId = excerptData.archiveId;
  const content = excerptData?.data?.excerptContent;
  const excerptId = excerptData?.data?.excerptId;
  const pageNumber = excerptData?.data?.pageNumber;
  const title = excerptData?.title;
  const author = excerptData?.author;

  return (
    <div onClick={onClick} className={`w-full ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex flex-col gap-5 w-full p-5 rounded-2xl bg-gray-10 shadow-custom">
        <div className="flex justify-between items-center">
          <div className={`text-right text-b2 text-gray-400 ${font}`}>
            {pageNumber}p
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className={`text-b2 text-gray-800 ${font}`}>{content}</div>
          <div className={`text-c1 text-gray-400 ${font}`}>
            {title && author && `${title} / ${author}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcerptCard;

