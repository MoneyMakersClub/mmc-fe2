import { useLocation } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import UserComment from "../../components/BookInfoPage/UserComment";
import Divider2 from "../../components/common/Divider2";
const UserCommentPage = () => {
  const { state } = useLocation();
  const ratingList = state?.ratingList || [];
  return (
    <div>
      <div className="flex flex-col gap-4">
        <NavigationHeader title={`한줄평 (${ratingList.length})`} />
        <div className="flex flex-col gap-1">
          {ratingList.length > 0 &&
            ratingList.map((oneLine, index) => (
              <div key={index} className="flex flex-col items-center">
                <UserComment data={oneLine} key={index} />
                <Divider2 />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default UserCommentPage;
