import { useLocation, useNavigate, useParams } from "react-router-dom";
import Divider1 from "../../components/common/Divider1";
import Divider2 from "../../components/common/Divider2";
import NavigationHeader from "../../components/common/NavigationHeader";
import StatusBar from "../../components/common/StatusBar";
import ColoredBookInfoComponent from "../../components/common/ColoredBookInfoComponent";
import ExcerptWritingComponent from "../../components/RecordingPage/ExcerptWritingComponent";
import Header2 from "../../components/RecordingPage/Header2";
import ReviewWritingComponent from "../../components/RecordingPage/ReviewWritingComponent";
import { useEffect, useState } from "react";
import BottomSheetModal from "../../components/common/modal/BottomSheetModal";
import WritingTemplate from "../../components/RecordingPage/WritingTemplate";
import ButtonComponent from "../../components/common/ButtonComponent";
import useBookInfoStore from "../../store/useBookInfoStore";
import {
  getDetailExtractReview,
  postExtractReview,
  putDetailExtractReview,
} from "../../api/archive";
import useExtractData from "../../store/useExtractDataStore";
import useReviewData from "../../store/useReviewDataStore";
import useReviewColorStore from "../../store/useReviewColorStore";
import { useQuery } from "@tanstack/react-query";
import { postExtractImage } from "../../api/archive";
import RecordingModal from "../../components/RecordingPage/RecordingModal";
import { get } from "../../api/example";
import { useNavigationHistory } from "../../utils/navigationUtils";

const EditPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { goBackFromEditing } = useNavigationHistory();
  const [viewBottomSheet, setViewBottomSheet] = useState(false);
  const [visible, setVisible] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState("");
  const [privateShow, setPrivateShow] = useState(false);
  const [reviewPrivateShow, setReviewPrivateShow] = useState(false);
  const { id } = useParams();
  const archiveId = id;
  const { reviewColor, setReviewColor } = useReviewColorStore();
  const { bookInfo, setBookInfo } = useBookInfoStore();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [initData, setInitData] = useState(true);
  const changedColor = location.state?.color;
  
  // 모달에서 사용할 임시 상태들
  const [tempExtractInputValue, setTempExtractInputValue] = useState("");
  const [tempPageInputValue, setTempPageInputValue] = useState("");
  const [tempTitleInputValue, setTempTitleInputValue] = useState("");
  const [tempReviewInputValue, setTempReviewInputValue] = useState("");
  
  
  // decoration 페이지에서 돌아왔을 때 색상 적용
  useEffect(() => {
    if (changedColor) {
      setReviewColor(changedColor);
    }
  }, [changedColor, setReviewColor]);
  
  const {
    data: font,
    isLoading: fontLoading,
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
    data: archiveDetailData,
    isError,
    error,
  } = useQuery({
    queryKey: ["archiveDetailData"],
    queryFn: () => getDetailExtractReview(archiveId),
  });


  useEffect(() => {
    if (!pageInputValue && !extractInputValue) {
      setPageInputValue(archiveDetailData.excerpt?.pageNumber);
      setExtractInputValue(archiveDetailData.excerpt?.excerptContent);
    }
    if (!titleInputValue && !reviewInputValue) {
      setTitleInputValue(archiveDetailData?.review?.reviewTitle);
      setReviewInputValue(archiveDetailData?.review?.reviewContent);
    }
    setReviewColor(archiveDetailData?.review?.color);
    setAuthor(archiveDetailData?.author);
    setTitle(archiveDetailData?.title);
    
    // visibility 상태
    if (archiveDetailData?.excerpt?.visibility === "PRIVATE") {
      setPrivateShow(true);
    }
    if (archiveDetailData?.review?.visibility === "PRIVATE") {
      setReviewPrivateShow(true);
    }
  }, [archiveDetailData]);

  useEffect(() => {
    if (changedColor) {
      setReviewColor(changedColor);
    }
  }, [changedColor]);

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
    goBackFromEditing();
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
  
  
  const handleExtractImage = async (e) => {
    // 문장스캔 이미지 처리
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await postExtractImage(formData);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
      }
    }
  };

  const handleExtractTextField = () => {
    // 모달 열 때 임시 상태에 현재 값 복사
    setTempExtractInputValue(extractInputValue || "");
    setTempPageInputValue(pageInputValue || "");
    setViewBottomSheet(true);
    setBottomSheetType("발췌");
    setTimeout(() => setVisible(true), 10);
  };

  const handleReviewTextField = () => {
    // 모달 열 때 임시 상태에 현재 값 복사
    setTempReviewInputValue(reviewInputValue);
    setTempTitleInputValue(titleInputValue);
    setViewBottomSheet(true);
    setBottomSheetType("감상평");
    setTimeout(() => setVisible(true), 10);
  };
  
  const handleWriteClick = () => {
    // "작성" 버튼 클릭 시 임시 상태를 실제 상태로 복사
    if (bottomSheetType === "발췌") {
      setExtractInputValue(tempExtractInputValue);
      setPageInputValue(tempPageInputValue);
    } else if (bottomSheetType === "감상평") {
      setReviewInputValue(tempReviewInputValue);
      setTitleInputValue(tempTitleInputValue);
    }
    handleBackdropClick();
  };

  const handleBackdropClick = () => {
    setVisible(false); // 닫는 애니메이션 시작
    setTimeout(() => {
      setViewBottomSheet(false); // 애니메이션이 끝난 후 모달 완전히 닫기
    }, 300);
  };

  const handleComplete = async () => {
    const data = {};
    if (pageInputValue && extractInputValue && reviewInputValue) {
      data.excerpt = {
        excerptContent: extractInputValue,
        excerptVisibility: privateShow === true ? "PRIVATE" : "PUBLIC",
        pageNumber: parseInt(pageInputValue, 10),
      };
      data.review = {
        reviewTitle: titleInputValue,
        reviewContent: reviewInputValue,
        color: reviewColor ? reviewColor : "#ABABAB",
        reviewVisibility: reviewPrivateShow === true ? "PRIVATE" : "PUBLIC",
      };
    } else if (pageInputValue && extractInputValue) {
      data.excerpt = {
        excerptContent: extractInputValue,
        excerptVisibility: privateShow === true ? "PRIVATE" : "PUBLIC",
        pageNumber: parseInt(pageInputValue, 10),
      };
    } else if (reviewInputValue) {
      data.review = {
        reviewTitle: titleInputValue,
        reviewContent: reviewInputValue,
        color: reviewColor ? reviewColor : "#ABABAB",
        reviewVisibility: reviewPrivateShow === true ? "PRIVATE" : "PUBLIC",
      };
      setReviewColor("");
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

    await putDetailExtractReview(archiveId, data);
    
    // PATCH 후 데이터를 다시 조회
    const detailData = await getDetailExtractReview(archiveId);

    const hasExcerpt = detailData.excerpt;
    const hasReview = detailData.review;
    
    // 쿼리 파라미터 제거하여 원래 페이지로 돌아가기
    const currentPath = location.pathname;
    
    if (hasExcerpt && hasReview) {
      navigate(`/total-archive-detail/${archiveId}`, {
        state: { detailData }
      });
    } else if (hasReview) {
      navigate(`/review-archive-detail/${archiveId}`, {
        state: { detailData }
      });
    } else if (hasExcerpt) {
      navigate(`/excerpt-archive-detail/${archiveId}`, {
        state: { detailData }
      });
    } else {
      navigate(currentPath);
    }
  };

  const handleDecoration = () => {
    const currentPath = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get('returnTo');
    const historyDelta = parseInt(searchParams.get('historyDelta') || '0') + 1;
    const decorationUrl = returnTo 
      ? `/recording/edit/${archiveId}/decoration?returnTo=${returnTo}&historyDelta=${historyDelta}`
      : `/recording/edit/${archiveId}/decoration`;
    
    navigate(decorationUrl, {
      state: {
        textValue: reviewInputValue,
        titleValue: titleInputValue,
        bookTitleValue: title,
        authorValue: author,
        returnPath: currentPath,
      },
    });
  };

  return (
    <>
      <StatusBar />
      <NavigationHeader
        title="기록하기"
        check={true}
        handleBack={handleBack}
        handleComplete={handleComplete}
      />
      <div className="flex flex-col mx-4 pt-[calc(env(safe-area-inset-top))]">
        <div className="flex justify-start">
          <ColoredBookInfoComponent
            bookInfo={bookInfo}
            edit={true}
            author={author}
            title={title}
          />
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
              handleExtractImage={handleExtractImage}
              tempTitleInputValue={tempTitleInputValue}
              handleTempTitleInputChange={handleTempTitleInputChange}
              tempReviewInputValue={tempReviewInputValue}
              handleReviewOnChange={handleReviewOnChange}
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
export default EditPage;
