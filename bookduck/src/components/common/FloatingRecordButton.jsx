import { useEffect, useState } from "react";
import floatingRecordWhite from "../../assets/common/floating-record-white.svg";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import useBookInfoStore from "../../store/useBookInfoStore";
import { getClubDetail } from "../../api/bookclub";
import { getBookInfo, getBookExternalInfo } from "../../api/bookinfo";

const FloatingRecordButton = ({ text = true, onRecordClick }) => {
  const [internalText, setInternalText] = useState(text);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { setBookInfo } = useBookInfoStore();

  useEffect(() => {
    // 화면 밖을 클릭하면 플로팅 버튼 닫기
    const handleTouchStart = (e) => {
      if (!e.target.closest('.floating-button-container')) {
        setInternalText(false);
      }
    };

    const handleScroll = () => {
      setInternalText(false);
    };

    if (internalText) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('scroll', handleScroll);
      
      // 2초 후 자동으로 닫기
      const timer = setTimeout(() => {
        setInternalText(false);
      }, 2000);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('scroll', handleScroll);
        clearTimeout(timer);
      };
    }
  }, [internalText]);

  const handleClick = () => {
    setInternalText(true);
  };

  const handleRecordClick = async () => {
    // onRecordClick prop이 있으면 커스텀 로직 실행
    if (onRecordClick) {
      onRecordClick();
      return;
    }
    
    const currentPath = location.pathname;
    
    // 북클럽 상세 페이지에서는 북클럽 책 정보를 store에 저장하고 기록 페이지로
    if (currentPath.includes('/bookclub/') && params.clubId) {
      try {
        const clubData = await getClubDetail(params.clubId);
        if (clubData?.clubBookInfo) {
          // 기록 페이지로 이동
          setBookInfo({
            bookUnitDto: {
              title: clubData.clubBookInfo.bookTitle,
              author: clubData.clubBookInfo.bookAuthor,
              imgPath: clubData.clubBookInfo.bookImgPath,
              bookInfoId: clubData.clubBookInfo.bookInfoId,
            },
            isCustom: clubData.clubBookInfo.isCustom,
            providerId: clubData.clubBookInfo.isCustom ? null : clubData.clubBookInfo.providerId,
            userBookId: clubData.userBookId,
          });
        }
        navigate(`${currentPath}?recording=true`, {
          state: {
            fromPath: currentPath,
            fromParams: params
          },
          replace: true
        });
      } catch (error) {
        console.log("북클럽 정보 로딩 실패:", error);
        navigate("/selectBook");
      }
    } 
    // 책 정보 페이지에서도 책 정보를 store에 저장하고 기록 페이지로
    else if (currentPath.includes('/info/book/')) {
      try {
        const bookinfoId = params.bookinfoId;
        if (bookinfoId) {
          const bookData = await getBookInfo({ bookinfoId });
          if (bookData?.bookInfoBasicDto) {
            const bookInfoToSet = {
              bookUnitDto: {
                title: bookData.bookInfoBasicDto.title,
                author: bookData.bookInfoBasicDto.author,
                imgPath: bookData.bookInfoBasicDto.imgPath,
                bookInfoId: bookData.bookInfoBasicDto.bookInfoId,
              },
              isCustom: bookData.bookInfoBasicDto.isCustom,
              providerId: bookData.providerId,
            };
            setBookInfo(bookInfoToSet);
          }
        }
        navigate(`${currentPath}?recording=true`, {
          state: {
            fromPath: currentPath,
            fromParams: params
          },
          replace: true
        });
      } catch (error) {
        console.error("책 정보 로딩 실패:", error);
        navigate("/selectBook");
      }
    } 
    // 다른 페이지에서는 책 선택 페이지로
    else {
      navigate("/selectBook");
    }
  };

  return (
    <div className="floating-button-container">
      {/* 기록하기 텍스트 버튼 */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          internalText ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {internalText && (
          <div
            onClick={handleRecordClick}
            className="flex gap-3 justify-center items-center h-[3.5rem] px-5 mr-[1rem] rounded-full bg-gray-700 cursor-pointer relative"
          >
            <img src={floatingRecordWhite} alt="record_icon" className="w-6 h-6" />
            <div className="text-btn1 font-semibold text-white whitespace-nowrap">기록하기</div>
          </div>
        )}
      </div>

      {/* 동그라미 버튼 */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          internalText ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {!internalText && (
          <div
            onClick={handleClick}
            className="flex justify-center items-center w-[3.5rem] h-[3.5rem] mr-[1rem] rounded-full bg-gray-700 cursor-pointer shadow-lg"
          >
            <img src={floatingRecordWhite} alt="record_icon" className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingRecordButton;
