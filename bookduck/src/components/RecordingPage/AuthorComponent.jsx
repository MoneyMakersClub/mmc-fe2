import { useNavigate } from "react-router-dom";
import img_template from "../../assets/recordingPage/img-template.svg";
import imgEx from "../../assets/common/bookImg-ex.svg";
const AuthorComponent = ({ archiveDetailData }) => {
  const navigate = useNavigate();

  const handleGotoBookInfo = () => {
    navigate(`/info/book/custom/${archiveDetailData.bookInfoId}`);
  };
  return (
    <>
      <div
        onClick={handleGotoBookInfo}
        className="w-[22.5625rem] px-4 py-[0.62rem] rounded-[0.5rem] bg-gray-50 cursor-pointer"
      >
        <div className="flex gap-[0.88rem]">
          <div>
            <img
              className="w-[3.0625rem] h-[4.375rem]"
              src={
                archiveDetailData.imgPath ? archiveDetailData.imgPath : imgEx
              }
              alt="img_template"
            />
          </div>
          <div className="flex flex-col gap-[0.2rem] justify-center">
            <div className="text-b2 text-gray-800 font-semibold">
              {archiveDetailData.title}
            </div>
            <div className="text-c1 text-gray-500">
              {archiveDetailData.author}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AuthorComponent;
