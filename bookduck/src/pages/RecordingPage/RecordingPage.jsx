import { useNavigate, useLocation } from "react-router-dom";
import { get } from "../../api/example";
import { useQuery } from "@tanstack/react-query";
import Divider2 from "../../components/common/Divider2";
import NavigationHeader from "../../components/common/NavigationHeader";
import ColoredBookInfoComponent from "../../components/common/ColoredBookInfoComponent";
import ExcerptWritingComponent from "../../components/RecordingPage/ExcerptWritingComponent";
import ReviewWritingComponent from "../../components/RecordingPage/ReviewWritingComponent";
import { useEffect, useState } from "react";
import BottomSheetModal from "../../components/common/BottomSheetModal";
import WritingTemplate from "../../components/RecordingPage/WritingTemplate";
import ButtonComponent from "../../components/common/ButtonComponent";
import useBookInfoStore from "../../store/useBookInfoStore";
import { postExtractReview } from "../../api/archive";
import useExtractData from "../../store/useExtractDataStore";
import useReviewData from "../../store/useReviewDataStore";
import useReviewColorStore from "../../store/useReviewColorStore";
import { postExtractImage } from "../../api/archive";
import RecordingModal from "../../components/RecordingPage/RecordingModal";

const RecordingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [viewBottomSheet, setViewBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState("");
  const [privateShow, setPrivateShow] = useState(false);
  const [reviewPrivateShow, setReviewPrivateShow] = useState(false);
  const { reviewColor, setReviewColor } = useReviewColorStore();
  const { bookInfo, setBookInfo } = useBookInfoStore();
  
  // 모달에서 사용할 임시 상태들
  const [tempExtractInputValue, setTempExtractInputValue] = useState("");
  const [tempPageInputValue, setTempPageInputValue] = useState("");
  const [tempTitleInputValue, setTempTitleInputValue] = useState("");
  const [tempReviewInputValue, setTempReviewInputValue] = useState("");

  useEffect(() => {
    setAuthor(location.state?.author);
    setTitle(location.state?.title);
    
    // decoration 페이지에서 돌아온 경우 모달 복원
    if (location.state?.returnFromDecoration) {
      setTempReviewInputValue(location.state.tempReviewInputValue || "");
      setTempTitleInputValue(location.state.tempTitleInputValue || "");
      setViewBottomSheet(true);
      setBottomSheetType("감상평");
      setTimeout(() => setVisible(true), 10);
    }
  }, [location.state]);

  const {
    data: font,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fontSettings"],
    queryFn: async () => {
      const response = await get(`/settings`);
      return response.recordFont;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const {
    pageInputValue,
    setPageInputValue,
    extractInputValue,
    setExtractInputValue,
  } = useExtractData();
  const {
    reviewPage,
    setReviewPage,
    titleInputValue,
    setTitleInputValue,
    reviewInputValue,
    setReviewInputValue,
  } = useReviewData();

  const handleBack = () => {
    setReviewColor("");
    navigate("/selectBook");
  };

  const handleCancel = () => {
    setReviewColor("");
    navigate("/selectBook");
  };

  const handleExtractOnChange = (e) => {
    setTempExtractInputValue(e.target.value);
  };
  const handleReviewOnChange = (e) => {
    setTempReviewInputValue(e.target.value);
  };
  
  const handleTempPageInputChange = (e) => {
    setTempPageInputValue(e.target.value);
  };
  
  const handleTempTitleInputChange = (e) => {
    setTempTitleInputValue(e.target.value);
  };

  // 스크롤 동기화 핸들러
  const handleExtractScroll = (e) => {
    const highlightDiv = e.target.previousSibling;
    if (highlightDiv) {
      highlightDiv.scrollTop = e.target.scrollTop;
    }
  };

  const handleReviewScroll = (e) => {
    const highlightDiv = e.target.previousSibling;
    if (highlightDiv) {
      highlightDiv.scrollTop = e.target.scrollTop;
    }
  };

  const handleExtractTextField = () => {
    // 기존 값을 임시 상태로 복사
    setTempExtractInputValue(extractInputValue);
    setTempPageInputValue(pageInputValue);
    setViewBottomSheet(true);
    setBottomSheetType("발췌");
  };

  const handleReviewTextField = () => {
    // 기존 값을 임시 상태로 복사
    setTempTitleInputValue(titleInputValue);
    setTempReviewInputValue(reviewInputValue);
    setViewBottomSheet(true);
    setBottomSheetType("감상평");
  };

  const handleBackdropClick = () => {
    setVisible(false); // 닫는 애니메이션 시작
    setTimeout(() => {
      setViewBottomSheet(false); // 애니메이션이 끝난 후 모달 완전히 닫기
    }, 300);
  };

  const handleWriteClick = () => {
    if (bottomSheetType === "발췌") {
      // 발췌 모달의 임시 값을 메인 상태로 복사
      setExtractInputValue(tempExtractInputValue);
      setPageInputValue(tempPageInputValue);
    } else if (bottomSheetType === "감상평") {
      // 감상평 모달의 임시 값을 메인 상태로 복사
      setTitleInputValue(tempTitleInputValue);
      setReviewInputValue(tempReviewInputValue);
    }
    
    setVisible(false); // 닫는 애니메이션 시작
    setTimeout(() => {
      setViewBottomSheet(false); // 애니메이션이 끝난 후 모달 완전히 닫기
    }, 300);
  };

  const handleExtractImage = async (e) => {
    const file = e.target.files[0]; // 선택한 파일
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const res = await postExtractImage(formData);
      setTempExtractInputValue(res.data);
    }
  };

  const handleComplete = async () => {
    const data = {};
    if (bookInfo.userBookId) {
      if (pageInputValue && extractInputValue && reviewInputValue) {
        data.excerpt = {
          excerptContent: extractInputValue,
          visibility: privateShow === true ? "PRIVATE" : "PUBLIC",
          pageNumber: parseInt(pageInputValue, 10),
          userBookId: bookInfo.userBookId ? bookInfo.userBookId : null,
        };
        data.review = {
          reviewTitle: titleInputValue,
          reviewContent: reviewInputValue,
          color: reviewColor,
          visibility: reviewPrivateShow === true ? "PRIVATE" : "PUBLIC",
          userBookId: bookInfo.userBookId ? bookInfo.userBookId : null,
        };
      } else if (pageInputValue && extractInputValue) {
        data.excerpt = {
          excerptContent: extractInputValue,
          visibility: privateShow === true ? "PRIVATE" : "PUBLIC",
          pageNumber: parseInt(pageInputValue, 10),
          userBookId: bookInfo.userBookId ? bookInfo.userBookId : null,
        };
      } else if (reviewInputValue) {
        data.review = {
          reviewTitle: titleInputValue,
          reviewContent: reviewInputValue,
          color: reviewColor,
          visibility: reviewPrivateShow === true ? "PRIVATE" : "PUBLIC",
          userBookId: bookInfo.userBookId ? bookInfo.userBookId : null,
        };
        setReviewColor("");
      }
    } else {
      data.excerpt = {
        excerptContent: extractInputValue,
        visibility: privateShow === true ? "PRIVATE" : "PUBLIC",
        pageNumber: parseInt(pageInputValue, 10),
        userBookId: null,
      };
      data.review = {
        reviewTitle: titleInputValue,
        reviewContent: reviewInputValue,
        color: reviewColor,
        visibility: reviewPrivateShow === true ? "PRIVATE" : "PUBLIC",
        userBookId: null,
      };
      data.userBook = {
        title: bookInfo.bookUnitDto.title,
        author: bookInfo.bookUnitDto.author,
        publisher: bookInfo.bookUnitDto?.publisher,
        publishDate: bookInfo.bookUnitDto?.publishDate,
        description: bookInfo.bookUnitDto?.description,
        genreId: bookInfo.bookUnitDto?.genreId,
        category: ["fiction"],
        imgPath: bookInfo.bookUnitDto?.imgPath,
        language: bookInfo.bookUnitDto?.language,
        readStatus: "READING",
        providerId: bookInfo.providerId,
      };
    }

    // userBook: {
    //   title: bookInfo.title,
    //   authors: [bookInfo.author],
    //   publisher: "bookInfo.publisher",
    //   publishDate: "2020-10-10",
    //   description: "<p><b>description...</p>",
    //   genreId: 1,
    //   category: ["fiction"],
    //   imgPath: bookInfo.imgPath,
    //   language: "한글",
    //   readStatus: bookInfo.readStatus,
    //   providerId: "Q7uTBgAAQBAJTEST3",
    // },

    const res = await postExtractReview(data);
    setBookInfo({});
    setPageInputValue();
    setExtractInputValue("");
    setTitleInputValue("");
    setReviewInputValue("");
    navigate("/archive");
  };

  const handleDecoration = () => {
    // 현재 날짜를 YYYY.MM.DD 형식으로 생성
    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    
    // 제목이 없으면 날짜 기반 제목 생성 (YYYY년 MM월 DD일의 기록)
    const defaultTitle = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일의 기록`;
    
    // 모달에서 호출되므로 임시 값을 전달
    navigate("/recording/decoration", {
      state: {
        textValue: tempReviewInputValue,
        titleValue: tempTitleInputValue || defaultTitle,
        bookTitleValue: bookInfo.bookUnitDto?.title || bookInfo.title || title,
        authorValue: bookInfo.bookUnitDto?.author || bookInfo.author || author,
        createdDate: formattedDate, // 오늘 날짜 추가
      },
    });
  };

  return (
    <>
      <NavigationHeader
        title="기록하기"
        check={true}
        handleCancel={handleCancel}
        handleBack={handleBack}
        handleComplete={handleComplete}
      />
      <div className="flex flex-col gap-4 mx-4 pt-[calc(env(safe-area-inset-top)+2.75rem)]">
        <div className="mt-5">
          <ColoredBookInfoComponent bookInfo={bookInfo} onClick={handleBack} />
        </div>
      </div>
      <div className="mx-4">
        <ExcerptWritingComponent
          inputValue={extractInputValue}
          setInputValue={setExtractInputValue}
          pageInputValue={pageInputValue}
          handleTextField={handleExtractTextField}
          privateShow={privateShow}
          setPrivateShow={setPrivateShow}
          font={font}
        />
      </div>
      <div className="mt-7 mb-4">
        <Divider2 />
      </div>
      <div className="mx-4">
        <ReviewWritingComponent
          inputValue={reviewInputValue}
          handleTextField={handleReviewTextField}
          titleInputValue={titleInputValue}
          bookTitleValue={bookInfo.title}
          authorValue={bookInfo.author}
          reviewPrivateShow={reviewPrivateShow}
          setReviewPrivateShow={setReviewPrivateShow}
          handleDecoration={handleDecoration}
          font={font}
        />
      </div>
      <div className="h-[7.5rem]"></div>
      <div className="relative">
        <BottomSheetModal
          bottomSheetShow={viewBottomSheet}
          setBottomSheetShow={setViewBottomSheet}
          visible={visible}
          setVisible={setVisible}
        >
          <div className="absolute w-10 h-1 top-[0.75rem] left-1/2 -translate-x-1/2 rounded-[0.25rem] bg-gray-300"></div>

          <div className="flex flex-col gap-4 items-center">
            <RecordingModal
              bottomSheetType={bottomSheetType}
              tempPageInputValue={tempPageInputValue}
              handleTempPageInputChange={handleTempPageInputChange}
              tempExtractInputValue={tempExtractInputValue}
              handleExtractOnChange={handleExtractOnChange}
              handleExtractScroll={handleExtractScroll}
              handleExtractImage={handleExtractImage}
              tempTitleInputValue={tempTitleInputValue}
              handleTempTitleInputChange={handleTempTitleInputChange}
              tempReviewInputValue={tempReviewInputValue}
              handleReviewOnChange={handleReviewOnChange}
              handleReviewScroll={handleReviewScroll}
              reviewColor={reviewColor}
              handleDecoration={handleDecoration}
              handleWriteClick={handleWriteClick}
              font={font}
            />
          </div>
        </BottomSheetModal>
      </div>
    </>
  );
};
export default RecordingPage;
