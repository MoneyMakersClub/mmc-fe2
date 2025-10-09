/**
 * 책 읽음 상태 변환 유틸리티
 */

// 영문 상태 -> 한글 상태
export const getReadingStatusKor = (status) => {
  switch (status) {
    case "NOT_STARTED":
      return "읽고 싶어요";
    case "READING":
      return "읽고 있어요";
    case "FINISHED":
      return "다 읽었어요";
    case "STOPPED":
      return "중단했어요";
    default:
      return "읽고 싶어요";
  }
};

// 한글 상태 -> 영문 상태
export const getReadingStatusKey = (status) => {
  switch (status) {
    case "읽고 싶어요":
      return "NOT_STARTED";
    case "읽고 있어요":
      return "READING";
    case "다 읽었어요":
      return "FINISHED";
    case "중단했어요":
      return "STOPPED";
    default:
      return "NOT_STARTED";
  }
};

// 상태 배열
export const statusArr = ["읽고 싶어요", "읽고 있어요", "다 읽었어요", "중단했어요"];

