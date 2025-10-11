import { useState } from "react";
import BookclubComponent from "../SearchPage/BookclubComponent";

const BookclubCardView = ({ clubs }) => {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {clubs.map((club) => (
        <BookclubComponent key={club.clubId} club={club} view="card" />
      ))}
    </div>
  );
};

export default BookclubCardView;
