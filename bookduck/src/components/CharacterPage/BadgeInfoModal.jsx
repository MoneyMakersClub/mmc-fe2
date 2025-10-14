const BadgeInfoModal = ({ onClick }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="flex flex-col py-4 gap-8 bg-white w-[330px] rounded-[20px]">
        <div className="flex flex-col gap-3">
          <div className="flex justify-center items-center text-st text-center font-semibold h-[48px]">
            배지 종류
          </div>
          <div className="flex flex-col px-8 gap-5 ">
            <div className="flex flex-col gap-1">
              <div className="text-b1 font-semibold">열정적인 독자</div>
              <div className="text-b2 text-gray-500">
                다 읽은 책 권수에 따라 획득할 수 있어요
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-b1 font-semibold">꼼꼼한 기록자</div>
              <div className="text-b2 text-gray-500">
                기록카드 개수에 따라 획득할 수 있어요
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-b1 font-semibold">성실한 평가자</div>
              <div className="text-b2 text-gray-500">
                남긴 한줄평 개수에 따라 획득할 수 있어요
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-b1 font-semibold">레벨업 마스터</div>
              <div className="text-b2 text-gray-500">
                레벨이 일정 단계에 도달하면 얻을 수 있어요
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 h-12">
          <button
            className="text-b1 font-semibold text-white bg-gray-700 p-2.5 w-[100%] h-12 rounded-lg"
            onClick={onClick}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
export default BadgeInfoModal;
