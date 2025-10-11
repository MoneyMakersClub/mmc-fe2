import MyBookclubCard from "../BookclubPage/MyBookclubCard";
import ExploreBookclubCard from "../BookclubPage/ExploreBookclubCard";

const BookclubListView = ({ clubs, type = "my" }) => {
  return (
    <div className="flex flex-col gap-3">
      {clubs.map((club) => (
        type === "my" ? (
          <MyBookclubCard key={club.clubId} club={club} />
        ) : (
          <ExploreBookclubCard key={club.clubId} club={club} />
        )
      ))}
    </div>
  );
};

export default BookclubListView;
