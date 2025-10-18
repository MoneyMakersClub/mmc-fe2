import React from "react";

const BookCountDisplay = ({ bookCount }) => {
  const digits = String(bookCount).split("");

  return (
    <div className="flex gap-1.5">
      {digits.map((digit, index) => (
        <p
          key={index}
          className="w-[2.25rem] h-[2.75rem] bg-orange-50 baloo text-[2rem] text-orange-300 font-bold text-center rounded-[0.5rem]"
        >
          {digit}
        </p>
      ))}
    </div>
  );
};

export default BookCountDisplay;
