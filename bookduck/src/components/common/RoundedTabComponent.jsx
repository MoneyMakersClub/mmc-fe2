const RoundedTabComponent = ({
  type = "primary",
  tabs = [],
  activeTab,
  activeTabs,
  multiple = false,
  onTabClick,
}) => {
  return (
    <>
      <div className={`flex ${type === "primary" ? "gap-[0.62rem]" : "gap-2"}`}>
        {tabs.map((tab, index) => (
          <div
            onClick={() => onTabClick(tab)}
            key={index}
            className={`px-[0.75rem] py-[0.38rem] rounded-[1.88rem] ${
              type === "primary"
                ? (multiple ? activeTabs.includes(tab) : activeTab === tab)
                  ? "bg-gray-700"
                  : "border-[0.0625rem] border-gray-200 bg-gray-50"
                : (multiple ? activeTabs.includes(tab) : activeTab === tab)
                ? "bg-orange-400"
                : "border-[0.0625rem] border-gray-200 bg-gray-50"
            } text-btn4 cursor-pointer`}

          >
            <div
              className={`flex justify-center items-center text-btn4 whitespace-nowrap ${
                (multiple ? activeTabs.includes(tab) : activeTab === tab)
                  ? "text-white"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default RoundedTabComponent;
