import { KakaoURI, GoogleURI } from "../../api/oauth";
import mainDuck from "../../assets/common/main-duck.svg";
import kakao from "../../assets/loginPage/kakao.svg";
import google from "../../assets/loginPage/google.svg";

const LoginPage = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div className="flex flex-col flex-grow justify-end bg-gray-10 px-5 py-6 ">
        <div className="self-center pb-[4rem]">
          <img src={mainDuck} className="w-[12.75rem] h-[12.375rem] " />
        </div>
        <div className="flex flex-col ">
          <p className="text-t1 font-semibold mb-2">환영해요!</p>
          <p className="text-b1 ">북덕과 함께 책을 읽고 기록을 쌓아보세요</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center bg-white py-5">
        <a
          href={GoogleURI}
          className="flex justify-center items-center gap-[0.62rem] w-[22.0625rem] h-[3rem] rounded-[0.5rem] border-solid border-[0.0938rem] border-[#ADADAD] bg-white mt-[1.69rem]"
        >
          <img src={google} alt="google logo" />
          Google로 시작하기
        </a>
        <a
          href={KakaoURI}
          className="flex justify-center items-center gap-[0.62rem] w-[22.0625rem] h-[3rem] rounded-[0.5rem] bg-[#FEE500]"
        >
          <img src={kakao} alt="kakao logo" />
          카카오로 시작하기
        </a>
        <p className="mt-[1.75rem] text-btn4 text-gray-500">
          소셜로그인으로 시작하세요
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
