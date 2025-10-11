import camera from "../../assets/recordingPage/camera-gray.svg";
import WritingTemplate from "./WritingTemplate";
import PublicRange from "./PublicRange";
import { useEffect, useState } from "react";
import { postExtractImage } from "../../api/archive";

const ExcerptWritingComponent = ({
  inputValue,
  setInputValue,
  handleTextField,
  pageInputValue,
  setPrivateShow,
  privateShow,
  font,
}) => {
  const handleToggle = () => {
    setPrivateShow(!privateShow);
  };

  const handleExtractImage = async (e) => {
    const file = e.target.files[0]; // 선택한 파일
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      console.log("발췌 시작");
      const res = await postExtractImage(formData);
      console.log(res.data);
      setInputValue(res.data);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-[0.38rem]">
        <div className="flex justify-between py-2 mt-4">
          <div className="text-b1 font-semibold">발췌</div>
          <div className="flex gap-3">
            <PublicRange
              setPrivateShow={setPrivateShow}
              privateShow={privateShow}
              handleToggle={handleToggle}
            />
          </div>
        </div>
        <div onClick={handleTextField} className="cursor-pointer">
          <WritingTemplate height="11rem">
            <div className="flex gap-1 justify-end text-b2 ">
              <div
                className={`${
                  pageInputValue ? "text-gray-800" : "text-gray-400"
                } ${font}`}
              >
                {pageInputValue ? pageInputValue : "페이지"}
              </div>
              <div className={`text-gray-400 ${font}`}>p</div>
            </div>
            <textarea
              value={inputValue}
              className={`w-[20.5625rem] h-[6rem] mt-2 bg-transparent text-b2 appearance-none outline-none resize-none ${font}`}
              placeholder="책의 구절을 입력하세요"
              readOnly
            />
          </WritingTemplate>
        </div>
      </div>
    </>
  );
};
export default ExcerptWritingComponent;
