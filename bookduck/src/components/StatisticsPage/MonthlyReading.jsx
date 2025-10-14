import StatisticsHeader from "./StatisticsHeader";
import BookRecord from "./BookRecord";

const MonthlyReading = ({ userData }) => {
  return (
    <div className="flex flex-col pt-5 h-[24.3125rem]">
      <StatisticsHeader
        title={`${userData?.isFirstHalf ? "상반기" : "하반기"} 월별 독서량`}
      />
      <div className="flex flex-col pt-[2.3475rem]">
        <div className="flex justify-between items-end">
          <div className=" bg-gray-100 rounded-tr-[0.625rem] w-[3.5rem] h-[3.75rem]" />
          <div className="flex items-end w-[16.125rem] h-[14rem]">
            <BookRecord
              userData={userData?.monthlyBookCount}
              isFirstHalf={userData?.isFirstHalf}
            />
          </div>
          <div className=" bg-gray-100 rounded-tl-[0.625rem] w-[3.5rem] h-[3.75rem]" />
        </div>
        {userData?.isFirstHalf ? (
          <div className="flex justify-center text-center gap-6 mt-[0.625rem] text-btn4 font-semibold text-gray-400">
            <span>1월</span>
            <span>2월</span>
            <span>3월</span>
            <span>4월</span>
            <span>5월</span>
            <span>6월</span>
          </div>
        ) : (
          <div className="flex justify-center text-center gap-6 mt-[0.625rem] text-btn4 font-semibold text-gray-400">
            <span>7월</span>
            <span>8월</span>
            <span>9월</span>
            <span>10월</span>
            <span>11월</span>
            <span>12월</span>
          </div>
        )}
      </div>
    </div>
  );
};
export default MonthlyReading;
