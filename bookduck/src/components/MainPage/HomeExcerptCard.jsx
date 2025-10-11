import lock from "../../assets/mainPage/lock.svg";
const HomeExcerptCard = ({
  title,
  author,
  pageNumber,
  content,
  onClick,
  selected,
  visibility,
}) => {
  return (
    <div className="cursor-pointer  w-full h-[8rem]" onClick={onClick}>
      <div
        className={`flex flex-col gap-[1.25rem] rounded-[0.875rem] bg-gray-10 shadow-custom p-5
          ${selected && " border-[1px] border-[#6B7FF0]"}`}
      >
        <div
          className={`flex ${
            visibility === "PRIVATE" ? "justify-between" : "text-right"
          } text-b2 text-gray-400`}
        >
          {visibility === "PRIVATE" && (
            <div className="flex items-center">
              <img src={lock} />
              <span className="text-btn4">나만보기</span>
            </div>
          )}
          <div>{pageNumber || "페이지"}p</div>
        </div>
        <div className="flex flex-col gap-[0.5rem]">
          <div className="text-b2 text-gray-800">
            {content || "발췌 카드 위젯을 만들어보세요"}
          </div>
          <div className="text-c1 text-gray-400">
            {title || "제목"} / {author || "작가"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomeExcerptCard;
