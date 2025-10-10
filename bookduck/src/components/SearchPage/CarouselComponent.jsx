import React from "react";
import { useNavigate } from "react-router-dom";
import BookComponent from "./BookComponent";

const CarouselComponent = ({ popularBooks }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-3">
      {popularBooks.map((book, index) => (
        <BookComponent
          key={index}
          img={book.imgPath}
          title={book.title}
          author={book.author}
          handleClick={() => navigate(`/info/book/${book.bookInfoId}`)}
        />
      ))}
    </div>
  );
};

export default CarouselComponent;
