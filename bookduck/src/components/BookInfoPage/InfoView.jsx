import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import right from "../../assets/common/right.svg";
import cover from "../../assets/bookinfoPage/cover.svg";
import BookPlot from "./BookPlot";
import Divider1 from "../common/Divider1";
import Divider2 from "../common/Divider2";
import UserComment from "./UserComment";
import { getRelatedBookInfo } from "../../api/bookinfo";
import CarouselComponent from "../SearchPage/CarouselComponent";

const InfoView = ({ bookData, ratingData }) => {
  const { bookinfoId } = useParams();
  const images = [cover, cover, cover, cover, cover, cover, cover];
  const ratingList = ratingData?.oneLineRatingList || [];

  const navigate = useNavigate();
  const handleCommentClick = () => {
    navigate("/info/book/comment", { state: { ratingList } });
  };
  const [relatedBookData, setRelatedBookData] = useState([]); // 초기값을 빈 배열로 설정
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRelatedBookInfo({ bookinfoId });
        setRelatedBookData(res?.bookList || []); // 응답이 없을 경우 빈 배열로 설정
      } catch (err) {
        console.error("오류 발생: ", err);
      }
    };
    fetchData();
  }, [bookinfoId]); // bookinfoId 변경 시 데이터를 다시 가져오도록 의존성 추가

  // 최대 3개만 표시
  const displayedRatings = ratingList.slice(0, 3);
  return (
    <div className="flex flex-col pb-[8rem] gap-5">
      <BookPlot bookData={bookData} />
      <Divider1 />
      {ratingList?.length > 0 && (
        <div className="flex flex-col items-center gap-1">
          <div className="flex px-4 text-b1 font-semibold justify-between items-center w-full">
            한줄평 ({ratingList?.length})
            <img
              className="cursor-pointer"
              src={right}
              onClick={handleCommentClick}
              alt="right"
            />
          </div>
          {displayedRatings.map((oneLine, index) => (
            <div className="flex flex-col items-center" key={index}>
              <UserComment data={oneLine} />
              <div className="w-[22.5625rem]">
                <Divider2 />
              </div>
            </div>
          ))}
        </div>
      )}
      <Divider1 />
      {relatedBookData?.length > 0 && ( // 데이터가 있을 때만 렌더링
        <div className="flex flex-col px-4 gap-6">
          <div className="text-b1 font-semibold">
            이 책을 읽은 사용자들이 읽은 다른 책
          </div>
          <CarouselComponent books={relatedBookData} />
        </div>
      )}
    </div>
  );
};
export default InfoView;
