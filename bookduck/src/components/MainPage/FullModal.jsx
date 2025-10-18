const FullModal = ({ onClick }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="flex flex-col py-4 bg-white w-[330px] rounded-[20px]">
        <div className="flex flex-col py-3 gap-2 mb-2">
          <div className="flex justify-center items-center text-st text-center font-semibold ">
            리딩스페이스가 꽉 찼어요!
          </div>
          <div className="flex justify-center items-center text-center text-b1">
            위젯은 최대 7개까지만 넣을 수 있어요.
          </div>
        </div>
        <div className="px-4">
          <button
            className="text-b1 font-semibold text-white bg-gray-700 p-2.5 w-full rounded-lg"
            onClick={onClick}
          >
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
};
export default FullModal;
