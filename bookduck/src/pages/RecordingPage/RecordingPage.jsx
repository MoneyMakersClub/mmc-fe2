import { useNavigate } from "react-router-dom";
import { get } from "../../api/example";
import { useQuery } from "@tanstack/react-query";
import Divider2 from "../../components/common/Divider2";
import NavigationHeader from "../../components/common/NavigationHeader";
import ColoredAuthorComponent from "../../components/RecordingPage/ColoredAuthorComponent";
import ExtractWritingComponent from "../../components/RecordingPage/ExtractWritingComponent";
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
import camera from "../../assets/recordingPage/camera-gray.svg";
import Cards from "../../components/RecordingPage/Cards";
import cards from "../../assets/recordingPage/cards.svg";
import { postExtractImage } from "../../api/archive";
import HighlightTextarea from "../../components/RecordingPage/HighlightTextarea";

const RecordingPage = () => {
  const navigate = useNavigate();
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
  }, []);

  const {
    data: font,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["fontSettings"],
    queryFn: async () => {
      const response = await get(`/settings`);
      console.log(response);
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
  console.log("pageInputValue:", pageInputValue, "extract:", extractInputValue);
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
      console.log("발췌 시작");
      const res = await postExtractImage(formData);
      console.log(res.data);
      setTempExtractInputValue(res.data);
    }
  };
  console.log(bookInfo);

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

    console.log(data);
    const res = await postExtractReview(data);
    console.log(res);
    setBookInfo({});
    setPageInputValue();
    setExtractInputValue("");
    setTitleInputValue("");
    setReviewInputValue("");
    navigate("/archive");
  };

  const handleDecoration = () => {
    navigate("/recording/decoration", {
      state: {
        textValue: reviewInputValue,
        titleValue: titleInputValue,
        bookTitleValue: title,
        authorValue: author,
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
      <div className="flex flex-col gap-[1rem] mx-4">
        <div className="mt-5">
          <ColoredAuthorComponent bookInfo={bookInfo} />
        </div>
      </div>
      <div className="mx-4">
        <ExtractWritingComponent
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
            {bottomSheetType === "발췌" && (
              <>
                <WritingTemplate height="18rem">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-end">
                       <div className="flex items-center justify-center gap-1">
                         <input
                           type="number"
                           placeholder="페이지"
                           value={tempPageInputValue}
                           onChange={handleTempPageInputChange}
                           className="w-[2.5rem] bg-transparent text-b2 text-gray-800"
                         />
                         <div className={`text-b2 text-gray-400 ${font}`}>p</div>
                       </div>
                     </div>
                     <HighlightTextarea
                       value={tempExtractInputValue}
                       onChange={handleExtractOnChange}
                       onScroll={handleExtractScroll}
                       placeholder="책의 구절을 입력하세요"
                       maxLength={300}
                       height="h-[11.5rem]"
                       font={font}
                     />
                  </div>
                  <div className="absolute bottom-5 left-4">
                    <label
                      htmlFor="ExtractImage"
                      className="flex gap-[0.47rem] items-center cursor-pointer"
                    >
                      <img src={camera} alt="camera" />
                      <div className="text-b2 text-gray-500">문장스캔</div>
                    </label>
                    <input
                      id="ExtractImage"
                      type="file"
                      className="hidden"
                      onChange={handleExtractImage}
                    />
                  </div>
                  <div className="absolute bottom-5 right-4">
                     <div className="text-btn3 text-gray-400">
                       <span className={tempExtractInputValue.length > 300 ? "text-red" : ""}>
                         {tempExtractInputValue.length}
                       </span>
                       /300
                     </div>
                  </div>
                </WritingTemplate>
                 <ButtonComponent
                   text="기록 작성"
                   type="primary"
                   color="gray"
                   onClick={handleWriteClick}
                   disabled={!tempExtractInputValue || !tempPageInputValue}
                 />
              </>
            )}
            {bottomSheetType === "감상평" && (
              <>
                 <WritingTemplate height="18rem">
                   <div className="flex flex-col gap-2">
                     <input
                       value={tempTitleInputValue}
                       onChange={handleTempTitleInputChange}
                       placeholder="제목 (25자 이내로 작성하세요)"
                       className={`text-b1 font-semibold bg-transparent ${font}`}
                     />
                     <HighlightTextarea
                       value={tempReviewInputValue}
                       onChange={handleReviewOnChange}
                       onScroll={handleReviewScroll}
                       placeholder="책에 대한 자유로운 감상을 기록하세요"
                       maxLength={1000}
                       height="h-[11rem]"
                       font={font}
                     />
                   </div>
                   <div className="absolute bottom-5 left-4">
                     <div className="flex items-center cursor-pointer" onClick={handleDecoration}>
                       {reviewColor ? (
                         <Cards stroke={reviewColor} />
                       ) : (
                         <img src={cards} />
                       )}
                       <div
                         style={reviewColor ? { color: reviewColor } : undefined}
                         className={`text-b2 ml-2 ${reviewColor ? "" : "text-gray-500"}`}
                       >
                         카드색상
                       </div>
                     </div>
                   </div>
                   <div className="absolute bottom-5 right-4">
                     <div className="text-btn3 text-gray-400">
                       <span className={tempReviewInputValue.length > 1000 ? "text-red" : ""}>
                         {tempReviewInputValue.length}
                       </span>
                       /1000
                     </div>
                   </div>
                 </WritingTemplate>
                 <ButtonComponent
                   text="기록 작성"
                   type="primary"
                   color="gray"
                   onClick={handleWriteClick}
                   disabled={!tempReviewInputValue}
                 />
              </>
            )}
          </div>
        </BottomSheetModal>
      </div>
    </>
  );
};
export default RecordingPage;
