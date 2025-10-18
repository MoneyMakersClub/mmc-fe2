import React, { createContext, useContext, useEffect, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

// SSE Context 생성
const SSEContext = createContext(null);
const DEFAULT_SSE_DATA = {
  isCommonAlarmChecked: null,
  isAnnouncementChecked: null,
  isItemUnlockedChecked: null,
  isLevelUpChecked: null,
  isBadgeUnlockedChecked: null,
  newLevel: null,
  newBadgeInfo: null,
};

// SSEProvider 컴포넌트
export const SSEProvider = ({ children }) => {
  const [sseData, setSseData] = useState(DEFAULT_SSE_DATA);
  const [eventSource, setEventSource] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // SSE 연결 설정
  const connectToSSE = () => {
    const tokenData = JSON.parse(localStorage.getItem("token") || "{}");
    const accessKey = tokenData?.accessToken;

    if (!accessKey) {
      console.error("Access key가 없어서 SSE 초기화가 중단되었습니다.");
      return null;
    }
    try {
      const newEventSource = new EventSourcePolyfill(
        `${import.meta.env.VITE_API_BASE_URL}/alarms/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${accessKey}`,
          },
          heartbeatTimeout: 300000000,
          withCredentials: true,
        }
      );

      console.log("SSE 연결 성공");

      // 이벤트 핸들러 등록
      newEventSource.onopen = () => {
        console.log("SSE 연결 열림");
        setIsConnected(true);
        setReconnectAttempts(0);
      };
      newEventSource.addEventListener("sse-alarm", onSSEMessageReceived);
      newEventSource.onerror = onSSEError;

      setEventSource(newEventSource); // 상태 저장
      return newEventSource;
    } catch (error) {
      console.error("SSE 연결 중 예외 발생:", error);
      return null;
    }
  };

  // SSE 메시지 수신 처리
  const onSSEMessageReceived = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("SSE 메시지 수신:", data);
      setSseData(data);
    } catch (error) {
      console.error("SSE 메시지 파싱 오류:", error);
    }
  };

  // SSE 연결 에러 처리
  const onSSEError = (error) => {
    console.error("SSE 연결 에러:", error);
  };

  // SSE 연결 및 정리
  useEffect(() => {
    if (!eventSource) {
      connectToSSE();
    }
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("SSE 연결 종료");
      }
    };
  }, [eventSource]);

  return (
    <SSEContext.Provider value={{ sseData, isConnected, reconnectAttempts }}>
      {children}
    </SSEContext.Provider>
  );
};

// SSEContext를 사용하는 커스텀 훅
export const useSSE = () => useContext(SSEContext);
