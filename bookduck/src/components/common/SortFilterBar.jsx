import down from "../../assets/common/down.svg";
import RoundedTabComponent from "./RoundedTabComponent";

const SortFilterBar = ({ 
  sort, 
  onSortClick, 
  tabs, 
  activeTabs, 
  onTabClick,
  multiple = true 
}) => {
  return (
    <div className="flex gap-5 w-full mx-4 pt-3 pb-3">
      <div
        onClick={onSortClick}
        className="flex items-center justify-center cursor-pointer"
      >
        <div className="text-btn3 text-gray-500 whitespace-nowrap">
          {sort}
        </div>
        <img className="w-4 h-4" src={down} alt="down" />
      </div>
      <div className="overflow-x-auto">
        <RoundedTabComponent
          type="secondary"
          tabs={tabs}
          activeTabs={activeTabs}
          onTabClick={onTabClick}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default SortFilterBar;
