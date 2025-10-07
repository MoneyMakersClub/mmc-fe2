import { NavLink } from "react-router-dom";
import main from "../../assets/common/bottom-nav-main.svg";
import main_active from "../../assets/common/bottom-nav-main-active.svg";
import search from "../../assets/common/bottom-nav-search.svg";
import search_active from "../../assets/common/bottom-nav-search-active.svg";
import record from "../../assets/common/bottom-nav-record.svg";
import record_active from "../../assets/common/bottom-nav-record-active.svg";
import character from "../../assets/common/bottom-nav-character.svg";
import character_active from "../../assets/common/bottom-nav-character-active.svg";
import library from "../../assets/common/bottom-nav-library.svg";
import library_active from "../../assets/common/bottom-nav-library-active.svg";

const BottomNavbar = () => {
  return (
    // 하단 Safe Area
    <div 
      className="fixed bottom-0 w-full max-w-[64rem] border-t-[0.3px] border-[#0000004D] bg-[#FFFFFF] z-[110]"
      style={{ 
        height: 'calc(4rem + var(--sab))',
        paddingBottom: 'var(--sab)'
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
        <NavLink to="/character">
          {({ isActive }) => (
            <>
              {isActive ? (
                <img src={character_active} />
              ) : (
                <img src={character} />
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
