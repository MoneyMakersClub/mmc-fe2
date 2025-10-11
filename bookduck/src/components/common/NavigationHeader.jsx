import { useNavigate } from "react-router-dom";
import header_arrow from "../../assets/common/header-arrow.svg";

/* 뒤로가기 + 왼쪽 정렬 제목 + 편집/취소/완료 버튼 */

//check = true면 취소 / 완료 버튼 표시
//edit은 "편집" 텍스트 띄울지 여부
//editState는 편집 텍스트를 클릭했는지 여부 (편집 버튼 클릭했으면 true)
const NavigationHeader = ({
  title = "제목",
  check = false,
  edit = false,
  editState = false,
  handleEdit,
  handleComplete,
  handleCancel,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 pt-[env(safe-area-inset-top)] flex justify-between items-center h-[2.75rem] px-4">
      <div className="flex items-center">
        <div className="cursor-pointer">
          <img onClick={handleBackClick} src={header_arrow} alt="arrow" />
        </div>
        <div className="text-st ml-[1.26rem] font-semibold">{title}</div>
      </div>
      {check && (
        <div className="flex gap-6">
          {handleCancel && (
            <div
              onClick={handleCancel}
              className="text-b1 text-gray-400 cursor-pointer"
            >
              취소
            </div>
          )}
          <div
            onClick={handleComplete}
            className="text-b1 text-blue-400 cursor-pointer"
          >
            완료
          </div>
        </div>
      )}
      {edit && (
        <div
          onClick={handleEdit}
          className={`flex items-center w-[36px] h-[36px] text-b1 text-gray-400 underline underline-offset-4 cursor-pointer
        `}
        >
          {editState ? "완료" : "편집"}
        </div>
      )}
    </div>
  );
};
export default NavigationHeader;

