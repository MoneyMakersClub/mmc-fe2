import { useNavigate } from "react-router-dom";
import logo from "../../assets/common/logo-text.svg";
import setting from "../../assets/common/setting.svg";
import alarm from "../../assets/common/alarm.svg";
import friends from "../../assets/common/people.svg";
import alarmCircle from "../../assets/common/circle-alarm.svg";

/* 메인 페이지용 헤더 */

//탭 이름을 props로 받음. default 값은 "제목"
//BookDuck이 탭 이름인 경우에는 main값이 true
const MainHeader = ({ title = "제목", main = true, isDot = false }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center h-[2.75rem]">
      {main ? (
        <img
          src={logo}
          alt="logo"
          onClick={() => navigate("/home")}
          className="cursor-pointer"
        />
      ) : (
        <div className="text-t2 ml-[16px] font-semibold">{title}</div>
      )}
      <div className="flex  gap-5">
        {main && (
          <>
            <img
              src={friends}
              alt="friends"
              onClick={() => navigate("/friend")}
              className="cursor-pointer"
            />
            <div className="relative">
              <img
                src={alarm}
                alt="alarm"
                onClick={() => navigate("/notification")}
                className="cursor-pointer"
              />
              {isDot === true && (
                <img
                  src={alarmCircle}
                  className="absolute right-[0.13rem] top-[0.25rem]"
                />
              )}
            </div>
          </>
        )}
        <img
          src={setting}
          alt="setting"
          onClick={() => navigate("/setting")}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
export default MainHeader;

