import React, { useState, useEffect } from "react";
import BottomSheetModal from "../common/BottomSheetModal";
import leftArrow from "../../assets/common/left.svg";
import rightArrow from "../../assets/common/right.svg";

const DatePickerModal = ({
  isOpen,
  onClose,
  onSelectDate,
  selectedDate,
  minDate = null,
  maxDate = null,
}) => {
  const [visible, setVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  // 모달이 열릴 때 visible을 true로 설정
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(year, month, day);
    clickedDate.setHours(0, 0, 0, 0);
    
    // minDate 체크
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (clickedDate < min) {
        return;
      }
    }
    
    // maxDate 체크
    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(0, 0, 0, 0);
      if (clickedDate > max) {
        return;
      }
    }

    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onSelectDate(formattedDate);
    
    // 애니메이션 후 모달 닫기
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    const date = new Date(selectedDate);
    const checkDate = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return date.getTime() === checkDate.getTime();
  };

  const isToday = (day) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return today.getTime() === checkDate.getTime();
  };

  const isPastDate = (day) => {
    if (!minDate) return false;
    const clickedDate = new Date(year, month, day);
    const min = new Date(minDate);  
    clickedDate.setHours(0, 0, 0, 0);
    min.setHours(0, 0, 0, 0);
    return clickedDate < min;
  };

  const isFutureDate = (day) => {
    if (!maxDate) return false;
    const clickedDate = new Date(year, month, day);
    const max = new Date(maxDate);
    clickedDate.setHours(0, 0, 0, 0);
    max.setHours(0, 0, 0, 0);
    return clickedDate > max;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // 빈 칸 추가 (시작 요일까지)
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="w-[2.5rem] h-[2.5rem]" />);
    }

    // 날짜 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isSelectedDate(day);
      const isTodayDate = isToday(day);
      const isPast = isPastDate(day);
      const isFuture = isFutureDate(day);
      const isDisabled = isPast || isFuture;

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleDateClick(day)}
          disabled={isDisabled}
          className={`
            w-[2.5rem] h-[2.5rem] rounded-lg text-b2 font-medium transition-all
            ${isSelected 
              ? 'bg-orange-300 text-white' 
              : isTodayDate
              ? 'bg-white text-orange-400 border-2 border-orange-400'
              : 'text-gray-800 hover:bg-gray-100'
            }
            ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <BottomSheetModal
      bottomSheetShow={isOpen}
      setBottomSheetShow={onClose}
      visible={visible}
      setVisible={setVisible}
      height="auto"
    >
      <div className="flex flex-col gap-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-2">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img src={leftArrow} alt="이전 달" className="w-5 h-5" />
          </button>
          
          <div className="text-b1 font-semibold text-gray-800">
            {year}년 {monthNames[month]}
          </div>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <img src={rightArrow} alt="다음 달" className="w-5 h-5" />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 px-2">
          {weekDays.map((day, index) => (
            <div
              key={day}
              className={`
                w-[2.5rem] h-[2.5rem] flex items-center justify-center text-b2 font-medium
                ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'}
              `}
              style={{
                color: index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : '#4b5563'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-1 px-2 pb-4">
          {renderCalendarDays()}
        </div>
      </div>
    </BottomSheetModal>
  );
};

export default DatePickerModal;

