import React from "react";
import imgEx from "../../assets/common/bookImg-ex.svg";
const BookComponent = ({ img, title, author, handleClick }) => {
  return (
    <div className="flex flex-col gap-2 w-[6.5rem] h-fit" onClick={handleClick}>
      <img src={img ? img : imgEx} className="w-full h-[9.25rem]" />
      <div>
        <div className="line-clamp-2">{title}</div>
        {author && <div className="text-btn3 text-gray-500">{author}</div>}
      </div>
    </div>
  );
};

export default BookComponent;
