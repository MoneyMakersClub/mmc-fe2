import React from "react";
import HomeExcerptCard from "./HomeExcerptCard";
import HomeReviewCard from "./HomeReviewCard";
import OneBookCard from "./OneBookCard";
import BookDisplay from "./BookDisplay";
const Card = ({ card }) => {
  switch (card.cardType) {
    case "EXCERPT":
      return (
        <HomeExcerptCard
          cardId={card.cardId}
          cardIndex={card.cardIndex}
          title={card.title}
          author={card.author}
          pageNumber={card.pageNumber}
          content={card.excerptContent}
          visibility={card.visibility}
        />
      );
    case "ONELINE":
      return (
        <HomeReviewCard
          cardId={card.cardId}
          cardIndex={card.cardIndex}
          title={card.title}
          author={card.author}
          rating={card.rating}
          content={card.oneLineContent}
        />
      );
    default:
      return (
        <BookDisplay
          type={card.cardType}
          cardId={card.cardId}
          cardIndex={card.cardIndex}
          imgPath1={card.imgPath1}
          imgPath2={card.imgPath2}
          text1={card.text1}
          text2={card.text2}
          text3={card.text3}
        />
      );
  }
};

export default Card;
