import React from "react";
import NavigationHeader from "./NavigationHeader";
import BottomNavbar from "./BottomNavbar";

/**
 * 페이지 레이아웃 컴포넌트
 * - 상단바와 하단바가 있는 페이지에서 콘텐츠가 겹치지 않도록 여백 설정
 */
const PageLayout = ({
  children,
  hasHeader = false,
  headerProps = {},
  customHeader = null,
  hasBottomNav = false,
  className = "",
}) => {
  const headerPadding = (hasHeader || customHeader) ? "pt-[2.75rem]" : "";
  
  const bottomNavPadding = hasBottomNav ? "pb-[calc(4rem+env(safe-area-inset-bottom))]" : "";

  return (
    <div className={`w-full min-h-screen ${className}`}>

      {customHeader || (hasHeader && <NavigationHeader {...headerProps} />)}
      
      <div className={`${headerPadding} ${bottomNavPadding}`}>
        {children}
      </div>

      {hasBottomNav && <BottomNavbar />}
    </div>
  );
};

export default PageLayout;

