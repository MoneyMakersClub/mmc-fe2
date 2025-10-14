const RecordCalender = ({ num, text, big = false }) => {
  return (
    <div
      className={`relative flex flex-col h-[6.1875rem] rounded-lg bg-white ${
        big ? "w-[138px]" : "w-[88px]"
      }`}
    >
      {big ? (
        <div className="absolute top-[-0.3125rem] left-[1.625rem] flex justify-between items-center w-20">
          <div className="w-1 h-2.5 rounded-sm bg-gray-500" />
          <div className="w-1 h-2.5 rounded-sm bg-gray-500" />
          <div className="w-1 h-2.5 rounded-sm bg-gray-500" />
          <div className="w-1 h-2.5 rounded-sm bg-gray-500" />
        </div>
      ) : (
        <div className="absolute top-[-0.3125rem] left-[1.625rem] flex justify-between items-center w-9">
          <div className="w-1 h-2.5 rounded-sm bg-gray-500" />
          <div className="w-1 h-2.5 rounded-sm bg-gray-500" />
        </div>
      )}

      <div className="h-4 rounded-t-lg bg-yellow-100" />
      <div className="flex flex-col items-center py-3 gap-0.5">
        <div className="text-c3 text-blue-400 font-semibold">{num}</div>
        <div className="text-btn3 text-gray-500">{text}</div>
      </div>
    </div>
  );
};
export default RecordCalender;
