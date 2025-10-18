const ColoredBookInfoComponent = ({ bookInfo, edit = false, author, title, onClick }) => {
  const bookTitle = bookInfo.bookUnitDto
    ? bookInfo.bookUnitDto?.title
    : bookInfo.title;
  const bookAuthor = bookInfo.bookUnitDto
    ? bookInfo.bookUnitDto?.author
    : bookInfo.author;
  return (
    <>
      <div 
        onClick={onClick}
        className="w-[22.5625rem] min-h-[3.5rem] p-4 rounded-[0.5rem] bg-orange-50 cursor-pointer"
      >
        <div className="text-b2 text-gray-800">
          <span className="font-semibold">{edit ? title : bookTitle}</span>
          <span> / </span>
          <span>{edit ? author : bookAuthor}</span>
        </div>
      </div>
    </>
  );
};

export default ColoredBookInfoComponent;