import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import main from "../../assets/common/bottom-nav-main.svg";
import main_active from "../../assets/common/bottom-nav-main-active.svg";
import search from "../../assets/common/bottom-nav-search.svg";
import search_active from "../../assets/common/bottom-nav-search-active.svg";
import record from "../../assets/common/bottom-nav-record.svg";
import record_active from "../../assets/common/bottom-nav-record-active.svg";
import character from "../../assets/common/bottom-nav-character.svg";
import character_active from "../../assets/common/bottom-nav-character-active.svg";
import bookclub from "../../assets/common/bottom-nav-bookclub.svg";
import bookclub_active from "../../assets/common/bottom-nav-bookclub-active.svg";
import library from "../../assets/common/bottom-nav-library.svg";
import library_active from "../../assets/common/bottom-nav-library-active.svg";

const BottomNavbar = () => {
  const [bottomOffset, setBottomOffset] = useState(0);

  useEffect(() => {
    // 브라우저/앱의 하단바 높이 감지
    const detectBottomBar = () => {
      // 1. Safe Area 환경변수 사용 (iOS Safari, PWA 등)
      const safeAreaBottom = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--sab').replace('px', '')) || 0;
      
      // 2. 실제 화면과 뷰포트 높이 차이로 추가 하단바 감지
      const screenHeight = window.screen.height;
      const windowHeight = window.innerHeight;
      const addressBarHeight = Math.max(screenHeight - windowHeight, 0);
      
      // 3. 브라우저 환경 감지
      const isInApp = window.navigator.userAgent.includes('Naver') || 
                     window.navigator.userAgent.includes('KAKAOTALK') ||
                     window.navigator.userAgent.includes('Line');
      
      // 4. 하단바 높이 계산
      let totalBottomOffset = safeAreaBottom;
      
      if (isInApp && addressBarHeight > 0) {
        // 앱 내 브라우저에서 하단바가 있는 경우
        totalBottomOffset += Math.max(addressBarHeight - 20, 0); // 20px는 주소창 예상 높이
      }
      
      setBottomOffset(totalBottomOffset);
    };

    detectBottomBar();
    
    // 화면 크기 변경 시 재계산
    window.addEventListener('resize', detectBottomBar);
    window.addEventListener('orientationchange', detectBottomBar);
    
    return () => {
      window.removeEventListener('resize', detectBottomBar);
      window.removeEventListener('orientationchange', detectBottomBar);
    };
  }, []);

  return (
    // 하단 Safe Area + 브라우저/앱 하단바 높이 고려
    <div 
      className="fixed bottom-0 w-full max-w-[64rem] border-t border-gray-300 bg-white shadow-sm z-[110]"
      style={{ 
        height: 'calc(4rem + var(--sab))',
        paddingBottom: `${bottomOffset}px`
      }}
    >
      <div className="flex  w-full justify-evenly items-center mt-[0.62rem] cursor-pointer">
        <NavLink to="/home">
          {({ isActive }) => (
            <>{isActive ? <img src={main_active} /> : <img src={main} />}</>
          )}
        </NavLink>
        <NavLink to="/search">
          {({ isActive }) => (
            <>{isActive ? <img src={search_active} /> : <img src={search} />}</>
          )}
        </NavLink>
        <NavLink to="/archive">
          {({ isActive }) => (
            <>{isActive ? <img src={record_active} /> : <img src={record} />}</>
          )}
        </NavLink>
        <NavLink to="/bookclub">
          {({ isActive }) => (
            <>
              {isActive ? (
                <img src={bookclub_active} />
              ) : (
                <img src={bookclub} />
              )}
            </>
          )}
        </NavLink>
        <NavLink to="/library">
          {({ isActive }) => (
            <>
              {isActive ? <img src={library_active} /> : <img src={library} />}
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};
export default BottomNavbar;
