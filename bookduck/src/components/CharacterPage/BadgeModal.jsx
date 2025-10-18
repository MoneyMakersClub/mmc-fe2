const BadgeModal = ({ badge, currentData }) => {
  const formattedDate = badge.createdDate?.replace(/-/g, ".");
  let text = "";
  let next = "";

  switch (badge.badgeType) {
    case "READ":
      text = `완독 수 ${badge?.unlockValue}권을`;
      next = `현재 완독 수 : ${currentData?.currentReadCount}/${badge?.unlockValue}`;
      break;

    case "ARCHIVE":
      text = `기록카드 수 ${badge?.unlockValue}개를`;
      next = `현재 기록카드 수 : ${currentData?.currentArchiveCount}/${badge?.unlockValue}`;
      break;
    case "ONELINE":
      text = `한줄평 수 ${badge?.unlockValue}개를`;
      next = `현재 남긴 한줄평 수 : ${currentData?.currentOneLineCount}/${badge?.unlockValue}`;
      break;
    case "LEVEL":
      text = `${badge?.unlockValue}레벨을`;
      next = `현재 레벨 : ${currentData?.currentLevel}`;
      break;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="flex flex-col items-center py-4 gap-2 bg-white w-[16rem] rounded-2xl">
        {badge?.isOwned ? (
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="text-st font-semibold h-[1.9375rem]">
              {badge?.description}
            </div>
            <img
              className="w-16 h-16"
              src={`assets/characterPage/badges/${badge?.badgeType}/${badge?.badgeName}.png`}
              alt={`${badge?.badgeName} badge`}
            />
            <div className="text-b2 text-gray-500">획득일: {formattedDate}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-3 gap-2">
            <div className="text-st font-semibold">
              아직 획득하지 못한 배지예요.
            </div>
            <div className="flex items-center text-center text-b1 ">
              {text} 달성해야 <br />
              해당 배지를 얻을 수 있어요.
            </div>
            <div className="text-b2 text-gray-500">{next}</div>
          </div>
        )}
        <div className="px-4 w-[100%] h-8">
          <button className="flex justify-center items-center text-btn3 font-semibold text-white bg-gray-700 p-2.5 w-[100%]  h-8 rounded-lg">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
export default BadgeModal;
