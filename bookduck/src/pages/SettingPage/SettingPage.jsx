import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, patch, post } from "../../api/example";
import NavigationHeader from "../../components/common/NavigationHeader";
import ToggleButton from "../../components/common/ToggleButtonComponent";
import BottomSheetModal from "../../components/common/modal/BottomSheetModal";
import TextField from "../../components/common/TextField";
import ButtonComponent from "../../components/common/ButtonComponent";
import DeleteModal from "../../components/common/modal/DeleteModal";
import edit from "../../assets/settingPage/edit.svg";
import kakaoLogin from "../../assets/settingPage/kakao-login.svg";
import google from "../../assets/loginPage/google.svg";

const SettingPage = () => {
  //상태 관리
  const navigate = useNavigate();
  const [settingInfo, setSettingInfo] = useState({
    nickname: "",
    loginType: "",
    email: "",
    isPushAlarmEnabled: null,
    isFriendRequestEnabled: null,
    recordFont: "",
  });

  const fonts = [
    { id: "NANUMGOTHIC", label: "나눔고딕체", value: "NANUMGOTHIC" },
    { id: "NANUMMYEONGJO", label: "나눔명조체", value: "NANUMMYEONGJO" },
    { id: "RIDIBATANG", label: "리디바탕체", value: "RIDIBATANG" },
  ];

  const [bottomSheetShow, setBottomSheetShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(null);

  //API연결
  //API-세팅정보받기
  const getSettingInfo = async () => {
    // console.log("세팅인포", settingInfo);
    try {
      const response = await get(`settings`);
      // console.log(response);
      setSettingInfo(response);
    } catch (error) {
      console.error("세팅 읽어오기 오류", error);
    }
  };

  //API-세팅옵션변경
  const patchSettingOption = async (field, value) => {
    try {
      const updatedSetting = { [field]: value };
      await patch(`/settings/options`, updatedSetting);
      // console.log("설정 업데이트 성공:", updatedSetting);
    } catch (error) {
      console.error("옵션 업데이트 오류", error);
    }
  };

  //API-닉네임체크
  const postNicknameCheck = async (nickname) => {
    console.log(nickname);
    try {
      const response = await post(`/settings/nickname/check`, {
        nickname: nickname,
      });
      // console.log("응답", response.isAvailable);
      setError(!response.isAvailable);
    } catch (error) {
      console.error("닉네임체크 오류", error);
    }
  };

  //API-닉네임변경
  const patchNickname = async (nickname) => {
    try {
      const updatedNickname = { nickname: nickname };
      const response = await patch(`/settings/nickname`, updatedNickname);
      // console.log("닉네임 변경 성공:", response);
      window.location.reload();
    } catch (error) {
      console.error("닉네임 변경 오류", error);
    }
  };

  //API-로그아웃
  const postLogout = async () => {
    try {
      await post(`/logout`);
      // console.log("로그아웃 완료");
    } catch (error) {
      console.error("로그아웃 오류", error);
    }
  };

  //API-회원 탈퇴
  const delUser = async () => {
    try {
      await patch(`settings/status`);
      localStorage.clear();
      setTimeout(() => location.reload(true), 2000);
    } catch (error) {
      console.error("회원 탈퇴 오류", error);
    }
  };

  //useEffect hooks
  //설정 읽기 정보 받아오기
  useEffect(() => {
    getSettingInfo();
  }, []);

  useEffect(() => {
    setInputValue(settingInfo.nickname);
  }, [settingInfo.nickname]);

  //바텀시트 닫기 시  설정 초기화
  useEffect(() => {
    if (!bottomSheetShow) {
      setInputValue(null);
      setError(null);
      setInputError(false);
      setIsSubmitted(false);
    }
  }, [bottomSheetShow]);

  useEffect(() => {
    if (error !== null) {
      console.log("현재 error 상태:", error);
    }
  }, [error]);

  //이벤트 핸들러

  //바텀시트 닫기
  const closeBottomSheet = () => {
    setVisible(false);
    setTimeout(() => {
      setBottomSheetShow(false);
      setInputValue(settingInfo.nickname);
    }, 200);
  };

  //delete 모달 닫기
  const handleDeleteModal = () => {
    setShowDeleteModal(false);
    closeBottomSheet();
  };

  //입력값 변경
  const handleValue = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setInputError(
      newValue.length > 8 || /[^a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/.test(newValue)
    );
    setIsSubmitted(false);
  };

  //확인버튼 클릭 시
  const handleEdit = () => {
    setError(null);
    setIsSubmitted(true);
    postNicknameCheck(inputValue);
  };

  //토글 알람
  const handleToggleAlarm = () => {
    const newValue = !settingInfo.isPushAlarmEnabled;
    setSettingInfo((prev) => ({
      ...prev,
      isPushAlarmEnabled: newValue,
    }));

    patchSettingOption("isPushAlarmEnabled", String(newValue));
  };

  //토글 친구신청
  const handleToggleFriendRequest = () => {
    const newValue = !settingInfo.isFriendRequestEnabled;
    setSettingInfo((prev) => ({
      ...prev,
      isFriendRequestEnabled: newValue,
    }));
    patchSettingOption("isFriendRequestEnabled", String(newValue));
  };

  //폰트 변경
  const handleFontChange = (fontValue) => {
    setSettingInfo((prev) => ({
      ...prev,
      recordFont: fontValue,
    }));
    patchSettingOption("recordFont", fontValue);
  };

  //완료 버튼 클릭
  const handleComplete = (inputValue) => {
    try {
      patchNickname(inputValue);
      closeBottomSheet();
    } catch (error) {
      console.error(error);
    }
  };

  //로그아웃
  const handleLogout = async () => {
    try {
      await postLogout();
      localStorage.clear();
      navigate(`/login`, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  //회원 탈퇴
  const handleAccountDelete = () => {
    delUser();
    navigate(`/login`, { replace: true });
  };

  return (
    <div className="relative w-full">
      <NavigationHeader title="설정" />
      <div className="flex flex-col gap-10 px-4 pt-[1.31rem]">
        <div>
          <div className="mb-5 text-st font-semibold">계정 정보</div>
          <div className="flex justify-between items-center h-8 mb-2">
            <span>이름</span>
            <div className="flex items-center gap-2">
              <span>{settingInfo.nickname}</span>
              <button onClick={() => setBottomSheetShow(true)}>
                <img src={edit} alt="edit button" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center h-8">
            <span>로그인정보</span>
            <div className="flex items-center gap-2.5">
              {settingInfo.loginType === "KAKAO" && (
                <img src={kakaoLogin} alt="kakao account" />
              )}
              {settingInfo.loginType === "GOOGLE" && (
                <img src={google} alt="google account" />
              )}
              <span>{settingInfo.email}</span>
            </div>
          </div>
        </div>
        <fieldset>
          <legend className="mb-5 text-st font-semibold">사용 설정</legend>
          <div className="flex justify-between items-center h-8 mb-4">
            <label htmlFor="alarmToggle">푸시 알림 허용</label>
            <ToggleButton
              id="alarmToggle"
              isOn={settingInfo.isPushAlarmEnabled}
              onToggle={handleToggleAlarm}
            />
          </div>
          <div className="flex justify-between items-center h-8">
            <label htmlFor="friendToggle">친구 추가 허용</label>
            <ToggleButton
              id="friendToggle"
              isOn={settingInfo.isFriendRequestEnabled}
              onToggle={handleToggleFriendRequest}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-5 text-st font-semibold">기록 폰트 설정</legend>
          <div className="flex flex-col gap-3 nanum-myeongjo">
            {fonts.map((font) => (
              <div key={font.id} className="flex items-center justify-between ">
                <label htmlFor={font.id} className={font.value}>
                  {font.label}
                </label>
                <input
                  type="radio"
                  id={font.id}
                  name="font"
                  value={font.value}
                  checked={settingInfo.recordFont === font.value}
                  onChange={() => handleFontChange(font.value)}
                  className="m-2"
                />
              </div>
            ))}
          </div>
        </fieldset>
        <div className="mt-[7.25rem] text-btn3 text-gray-500 self-center">
          <button onClick={handleLogout}>로그아웃</button>
          <span> | </span>
          <button onClick={handleAccountDelete}>탈퇴하기</button>
        </div>
      </div>
      <BottomSheetModal
        bottomSheetShow={bottomSheetShow}
        setBottomSheetShow={setBottomSheetShow}
        visible={visible}
        setVisible={setVisible}
      >
        <div className="px-4">
          <div className="flex justify-between mb-[1.62rem]">
            <span className="text-st font-semibold">이름 수정</span>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-btn2 text-gray-500"
            >
              취소
            </button>
          </div>
          <TextField
            type="제목"
            title="닉네임"
            placeholder="닉네임을 입력해주세요"
            check={true}
            error={error}
            inputError={inputError}
            handleEdit={handleEdit}
            isSubmitted={isSubmitted}
            nickname={true}
            defaultType={false}
            handleValue={(e) => handleValue(e)}
            inputValue={inputValue}
          />
          <ButtonComponent
            text="완료"
            type="primary"
            disabled={!isSubmitted || error}
            className="mt-7"
            onClick={() => handleComplete(inputValue)}
          />
        </div>
      </BottomSheetModal>
      {showDeleteModal && (
        <DeleteModal
          title={`수정된 이름을\n저장하지 않고 나갈까요?`}
          leftBtnText="나가기"
          rightBtnText="계속하기"
          onLeftClick={handleDeleteModal}
          onRightClick={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default SettingPage;
