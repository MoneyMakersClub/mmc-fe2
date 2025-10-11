import React from "react";
import NavigationHeader from "../../components/common/NavigationHeader";
import DirectRegister from "../../components/RecordingPage/DirectRegister";
const RegisterPage = () => {
  return (
    <div className="w-full max-w-[64rem]">
      <NavigationHeader title="책 등록하기" />
      <DirectRegister />
    </div>
  );
};

export default RegisterPage;
