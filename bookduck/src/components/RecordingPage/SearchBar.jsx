import { useState } from "react";
import search from "../../assets/common/search-gray.svg";

const SearchBar = () => {
  const [inputValue, setInputValue] = useState("");
  const handleInputValue = (e) => {
    setInputValue(e.target.value);
  };
  return (
    <div className="flex items-center gap-[1rem]">
      <div className="flex items-center w-[19.4375rem] h-[2.5rem] p-0.5 rounded-lg bg-gray-50">
        <div className="flex items-center">
          <img className="m-[0.5rem]" src={search} alt="search" />
          <input
            value={inputValue}
            onChange={handleInputValue}
            placeholder="검색어를 입력하세요"
            className="w-[14rem] h-[1.5rem] bg-transparent"
          />
        </div>
      </div>
      <div
        onClick={() => setInputValue("")}
        className="text-b1 text-gray-500 cursor-pointer"
      >
        취소
      </div>
    </div>
  );
};
export default SearchBar;
