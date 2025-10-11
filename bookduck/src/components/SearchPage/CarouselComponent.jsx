import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookComponent from "./BookComponent";

const CarouselComponent = ({ books }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // 페이지당 3개씩 표시
  const booksPerPage = 3;
  const totalPages = Math.ceil(books.length / booksPerPage);
  
  // 현재 페이지의 책들
  const currentBooks = books.slice(
    currentPage * booksPerPage,
    (currentPage + 1) * booksPerPage
  );

  // 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // 다음 페이지로 (마지막 페이지면 첫 페이지로)
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }
    if (isRightSwipe) {
      // 이전 페이지로 (첫 페이지면 마지막 페이지로)
      setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }
  };

  // 책 클릭 핸들러
  const handleBookClick = (bookInfoId) => {
    navigate(`/info/book/${bookInfoId}`);
  };

  // 3권 이하면 그리드
  if (books.length <= 3) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {books.map((book, index) => (
          <BookComponent
            key={index}
            img={book.imgPath}
            title={book.title}
            // author={book.author}
            handleClick={() => handleBookClick(book.bookInfoId)}
          />
        ))}
      </div>
    );
  }

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
        {/* 책들 */}
        <div className="grid grid-cols-3 gap-6">
          {currentBooks.map((book, index) => (
            <BookComponent
              key={index}
              img={book.imgPath}
              title={book.title}
              // author={book.author}
              handleClick={() => handleBookClick(book.bookInfoId)}
            />
          ))}
        </div>
        
        {/* 페이지네이션 dots */}
        <div className="flex justify-center items-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-[0.375rem] h-[0.375rem] rounded-full border-none cursor-pointer transition-colors duration-200 ${
                currentPage === index ? 'bg-gray-800' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
    </div>
  );
};

export default CarouselComponent;