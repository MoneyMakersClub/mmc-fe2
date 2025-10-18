import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TabBarComponent from "../../components/common/TabBarComponent";
import MyBookclubPage from "./MyBookclubPage";
import ExploreBookclubPage from "./ExploreBookclubPage";
import BasicHeader from "../../components/common/BasicHeader";
import BottomNavbar from "../../components/common/BottomNavbar";
import BookclubCreateIcon from "../../components/BookclubPage/BookclubCreateIcon";

const BookclubPage = () => {
  const navigate = useNavigate();
  const [clickedPage, setClickedPage] = useState(
    localStorage.getItem("bookclubClickedPage") || "내 북클럽"
  );

  useEffect(() => {
    const savedPage = localStorage.getItem("bookclubClickedPage");
    if (savedPage) {
      setClickedPage(savedPage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookclubClickedPage", clickedPage);
  }, [clickedPage]);

  const handleCreateClick = () => {
    navigate("/bookclub/create");
  };

  return (
    <>
      <div className="relative flex flex-col ">
        <BasicHeader title="북클럽" />
        <TabBarComponent
          tabs={["내 북클럽", "둘러보기"]}
          activeTab={clickedPage}
          onTabClick={setClickedPage}
          size="small"
          borderWidth="3rem"
        />

        <div className="absolute  top-[3.8rem] right-[0.63rem]">
          <BookclubCreateIcon 
            handleClick={handleCreateClick}
          />
        </div>

        <div>
          {clickedPage === "내 북클럽" && <MyBookclubPage />}
          {clickedPage === "둘러보기" && <ExploreBookclubPage />}
        </div>
        <BottomNavbar />
      </div>
    </>
  );
};

export default BookclubPage;