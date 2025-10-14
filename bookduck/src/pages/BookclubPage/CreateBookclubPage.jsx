import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import TextField from "../../components/common/TextField";
import ButtonComponent from "../../components/common/ButtonComponent";
import ColoredBookInfoComponent from "../../components/common/ColoredBookInfoComponent";
import DatePickerModal from "../../components/BookclubPage/DatePickerModal";
import { createClub } from "../../api/bookclub";
import useBookInfoStore from "../../store/useBookInfoStore";

const CreateBookclubPage = () => {
  const navigate = useNavigate();
  const { selectedBookInfo, clearBookInfo } = useBookInfoStore();
  
  const [clubName, setClubName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [activeStartDate, setActiveStartDate] = useState("");
  const [activeEndDate, setActiveEndDate] = useState("");
  const [maxMember, setMaxMember] = useState(10);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleCreateClub = async () => {
    if (!selectedBookInfo) {
      alert("책을 선택해주세요.");
      return;
    }

    const clubData = {
      clubName,
      password,
      description,
      activeStartDate,
      activeEndDate,
      bookInfoId: selectedBookInfo.bookInfoId,
      maxMember
    };

    try {
      const response = await createClub(clubData);
      console.log("북클럽 생성 성공:", response);
      clearBookInfo();
      navigate("/bookclub");
    } catch (error) {
      console.error("북클럽 생성 실패:", error);
      alert("북클럽 생성에 실패했습니다.");
    }
  };

  const handleSelectBook = () => {
    navigate("/select-book-for-club");
  };

  const handleBack = () => {
    navigate("/bookclub");
  };

  const handleStartDateSelect = (date) => {
    setActiveStartDate(date);
    setShowStartDatePicker(false);
  };

  const handleEndDateSelect = (date) => {
    setActiveEndDate(date);
    setShowEndDatePicker(false);
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const isFormValid = clubName && activeStartDate && activeEndDate && selectedBookInfo;

  return (
    <div className="w-full max-w-[64rem]">
      <NavigationHeader title="북클럽 만들기" handleBack={handleBack} />
      <div className="pt-[calc(env(safe-area-inset-top)+2.75rem)]">
        <div className="w-full flex flex-col justify-center items-center pb-[2.15rem] px-4">
          
          {/* 책 선택 섹션 */}
          <div className="w-full mb-8 pt-6">
            <div className="text-b1 font-medium text-gray-800 mb-3">
                읽을 책 <span className="text-orange-400">*</span>
                </div>
            {selectedBookInfo ? (
              <ColoredBookInfoComponent bookInfo={selectedBookInfo} onClick={handleSelectBook} />
            ) : (
              <div 
                onClick={handleSelectBook}
                className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="text-center text-b1 text-gray-400">
                  책을 선택해주세요
                </div>
              </div>
            )}
          </div>

          {/* 폼 필드들 */}
          <div className="w-full flex flex-col gap-8 mb-6">
            <div className="w-full">
              <div className="text-b1 font-medium text-gray-800 mb-2">
                북클럽명 <span className="text-orange-400">*</span>
              </div>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="북클럽명을 입력해주세요"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-b1"
              />
            </div>
            
            <div className="w-full">
              <div className="text-b1 font-medium text-gray-800 mb-2">비밀번호</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 없이 열린 북클럽을 만들어보세요"
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-b1"
              />
            </div>

            <div className="w-full">
              <div className="text-b1 font-medium text-gray-800 mb-2">설명</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="북클럽에 대한 설명을 작성해주세요"
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:border-orange-400 text-b1"
                rows={4}
              />
            </div>

            <div className="w-full flex gap-4">
              <div className="flex-1">
                <div className="text-b1 font-medium text-gray-800 mb-2">
                  시작일 <span className="text-orange-400">*</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStartDatePicker(true)}
                  className={`w-full p-3 border rounded-lg text-left text-b1 transition-all ${
                    activeStartDate
                      ? 'border-gray-200 text-gray-800'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {activeStartDate ? formatDateForDisplay(activeStartDate) : '날짜 선택'}
                </button>
              </div>
              <div className="flex-1">
                <div className="text-b1 font-medium text-gray-800 mb-2">
                  종료일 <span className="text-orange-400">*</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEndDatePicker(true)}
                  className={`w-full p-3 border rounded-lg text-left text-b1 transition-all ${
                    activeEndDate
                      ? 'border-gray-200 text-gray-800'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  {activeEndDate ? formatDateForDisplay(activeEndDate) : '날짜 선택'}
                </button>
              </div>
            </div>

            <div className="w-full">
              <div className="text-b1 font-medium text-gray-800 mb-2">
                최대 인원 <span className="text-orange-400">*</span>
              </div>
              <input
                type="number"
                min="2"
                max="50"
                value={maxMember}
                onChange={(e) => setMaxMember(parseInt(e.target.value) || 2)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-400 text-b1"
              />
            </div>
          </div>

          {/* 완료 버튼 */}
          <ButtonComponent
            onClick={handleCreateClub}
            text="북클럽 만들기"
            type="primary"
            disabled={!isFormValid}
          />
        </div>
      </div>

      {/* 시작일 달력 모달 */}
      <DatePickerModal
        isOpen={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onSelectDate={handleStartDateSelect}
        selectedDate={activeStartDate}
        minDate={new Date().toISOString().split('T')[0]}
      />

      {/* 종료일 달력 모달 */}
      <DatePickerModal
        isOpen={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onSelectDate={handleEndDateSelect}
        selectedDate={activeEndDate}
        minDate={activeStartDate || new Date().toISOString().split('T')[0]}
      />
    </div>
  );
};

export default CreateBookclubPage;
