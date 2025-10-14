const LevelModal = ({ onClick }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[200]">
      <div className="flex flex-col py-4 gap-5 bg-white w-[330px] rounded-[20px]">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center text-t2 text-center font-semibold h-[3rem]">
            레벨업을 위한 팁!
          </div>
          <div className="flex flex-col items-center px-7 gap-3 text-b1">
            <span>1. 독서기록 작성하기</span>
            <span>2. 별점과 한줄평 꼭 남기기</span>
            <span>3. 완독 후 ‘다 읽었어요’로 저장하기</span>
          </div>
          <div className="mx-4 p-3 bg-gray-10 text-center text-gray-500 text-btn4 rounded-lg">
            💡 레벨업 팁을 참고하여 경험치를 쌓아보세요!
          </div>
        </div>
        <div className="px-4 h-12">
          <button
            className="text-b1 font-semibold text-white bg-gray-700 p-2.5 w-[100%] h-12 rounded-lg"
            onClick={onClick}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
export default LevelModal;
