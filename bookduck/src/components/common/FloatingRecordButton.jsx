import { useEffect, useState } from "react";
import floatingRecordWhite from "../../assets/common/floating-record-white.svg";
import { useNavigate } from "react-router-dom";

const FloatingRecordButton = ({ handleNavigate, text = true }) => {
  const [internalText, setInternalText] = useState(text);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (internalText) {
      timer = setTimeout(() => {
        setInternalText(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [internalText]);

  const handleClick = () => {
    setInternalText(true);
  };

  return (
    <>
      {/* 기록하기 텍스트 버튼 */}
      <div
        className={`transition-all duration-500 ease-in-out z-50 ${
          internalText ? "opacity-100" : "opacity-0"
        }`}
      >
        {internalText ? (
          <div
            onClick={handleNavigate}
            className="flex gap-3 justify-center items-center h-[3.5rem] px-5 mr-[1rem] rounded-full bg-gray-700 cursor-pointer"
          >
            <img src={floatingRecordWhite} alt="record_icon" className="w-6 h-6" />
            <div className="text-btn1 font-semibold text-white whitespace-nowrap">기록하기</div>
          </div>
        ) : null}
      </div>

      {/* 동그라미 버튼 */}
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          internalText ? "opacity-0" : "opacity-100"
        }`}
      >
        {!internalText ? (
          <div
            onClick={handleClick}
            className="flex justify-center items-center w-[3.5rem] h-[3.5rem] mr-[1rem] rounded-full bg-gray-700 cursor-pointer shadow-lg"
          >
            <img src={floatingRecordWhite} alt="record_icon" className="w-6 h-6" />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default FloatingRecordButton;
