import down from "../../assets/common/down.svg";
import RoundedTabComponent from "./RoundedTabComponent";

const SortFilterBar = ({ 
  sort, 
  onSortClick, 
  tabs, 
  activeTab,
  activeTabs, 
  onTabClick,
  multiple = true,
  disableSort = false
}) => {
  return (
    <div className="flex gap-5 w-full px-4 pt-3 pb-3">
      <div
        onClick={disableSort ? undefined : onSortClick}
        className={`flex items-center justify-center flex-shrink-0 ${
          disableSort ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="text-btn3 text-gray-500 whitespace-nowrap">
          {sort}
        </div>
        <img className="w-4 h-4" src={down} alt="down" />
      </div>
      <div className="overflow-x-auto flex-1 min-w-0">
        <RoundedTabComponent
          type="secondary"
          tabs={tabs}
          activeTab={activeTab}
          activeTabs={activeTabs}
          onTabClick={onTabClick}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default SortFilterBar;
