import { useLocation, useNavigate, useParams } from "react-router-dom";
import NavigationHeader from "../../components/common/NavigationHeader";
import StatusBar from "../../components/common/StatusBar";
import ReviewCard from "../../components/RecordingPage/ReviewCard";
import Divider1 from "../../components/common/Divider1";
import RoundedTabComponent from "../../components/common/RoundedTabComponent";
import { useEffect, useState } from "react";
import ColorPalette from "../../components/RecordingPage/ColorPalette";
import { colorDefaultPalette } from "../../constant/colorDefaultPalette";
import { colorThemePalette } from "../../constant/colorThemePalette";
import ButtonComponent from "../../components/common/ButtonComponent";
import useReviewColorStore from "../../store/useReviewColorStore";
import { useQuery } from "@tanstack/react-query";
import { get } from "../../api/example";

const EditCardDecorationPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("기본");
  const { reviewColor, setReviewColor } = useReviewColorStore();
  const navigate = useNavigate();
  const textValue = location.state?.textValue;
  const reviewTitleValue = location.state?.titleValue;
  const bookTitleValue = location.state?.bookTitleValue;
  const authorValue = location.state?.authorValue;
  const { id } = useParams();
  const archiveId = id;

  // 폰트 설정 가져오기
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

  const reviewData = {
    title: bookTitleValue,
    author: authorValue,
    data: {
      reviewContent: textValue,
      reviewTitle: reviewTitleValue,
      color: reviewColor,
    },
  };

  const hanldleColor = (color) => {
    setReviewColor(color);
  };

  const handleComplete = () => {
    navigate(`/recording/edit/${archiveId}`, { 
      state: { color: reviewColor },
      replace: true // 히스토리에서 decoration 제거
    });
  };

  return (
    <>
      <StatusBar />
      <NavigationHeader title="감상평 카드 꾸미기" />
      <div className="px-4 pt-[calc(env(safe-area-inset-top)+2.75rem+2.69rem)] mb-[20rem]">
        <ReviewCard reviewData={reviewData} font={font} />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[1.25rem] shadow-custom2">
        <div className="px-6 pt-8 pb-3">
          <RoundedTabComponent
            type="primary"
            tabs={["기본", "테마"]}
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />
        </div>
        <div className="px-[1.88rem] py-5">
          {activeTab === "기본" && (
            <ColorPalette
              palette={colorDefaultPalette}
              handleColor={hanldleColor}
            />
          )}
          {activeTab === "테마" && (
            <ColorPalette
              palette={colorThemePalette}
              handleColor={hanldleColor}
            />
          )}
        </div>
        <div className="px-4 pb-[env(safe-area-inset-bottom)] pb-8">
          <ButtonComponent
            text="완료"
            type="primary"
            color="gray"
            onClick={handleComplete}
          />
        </div>
      </div>
    </>
  );
};
export default EditCardDecorationPage;
