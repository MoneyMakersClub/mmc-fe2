import { useNavigate, useLocation } from "react-router-dom";

export const useNavigationHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBasePath = (currentPath = location.pathname) => {
    return currentPath.split('?')[0];
  };

  const isRecordablePage = (path = location.pathname) => {
    const basePath = getBasePath(path);
    
    // Recording 진입 가능한 패턴들
    const recordingPatterns = [
      /^\/bookclub\/\d+$/,           // /bookclub/:clubId
      /^\/info\/book\/\d+$/,         // /info/book/:bookinfoId
      /^\/info\/book\/external\/.+/, // /info/book/external/:providerId
      /^\/info\/book\/custom\/\d+$/, // /info/book/custom/:bookinfoId
      // /archive는 제외 - 직접 기록하기 페이지이므로
    ];
    
    // Editing 진입 가능한 패턴들
    const editingPatterns = [
      /^\/excerpt-archive-detail\/\d+$/, // /excerpt-archive-detail/:id
      /^\/review-archive-detail\/\d+$/,  // /review-archive-detail/:id
      /^\/total-archive-detail\/\d+$/,   // /total-archive-detail/:id
    ];
    
    return recordingPatterns.some(pattern => pattern.test(basePath)) ||
           editingPatterns.some(pattern => pattern.test(basePath));
  };


  // URL 파라미터에서 returnTo 경로 가져오기
  const getReturnPath = (defaultPath = '/home') => {
    const searchParams = new URLSearchParams(location.search);
    const returnTo = searchParams.get('returnTo');
    
    if (returnTo) {
      return decodeURIComponent(returnTo);
    }
    
    return defaultPath;
  };

  const goBackFromEditing = () => {
    const targetPath = getReturnPath('/home');
    navigate(targetPath, { replace: true });
  };

  const goBackFromRecording = () => {
    const searchParams = new URLSearchParams(location.search);
    const targetPath = getReturnPath('/archive');
    const historyDelta = parseInt(searchParams.get('historyDelta') || '1');
    
    if (targetPath !== '/archive') {
      navigate(-historyDelta);
    } else {
      navigate('/archive', { replace: true });
    }
  };

  const goBackAfterComplete = () => {
    const searchParams = new URLSearchParams(location.search);
    const targetPath = getReturnPath('/archive');
    const historyDelta = parseInt(searchParams.get('historyDelta') || '1');
    
    if (targetPath !== '/archive') {
      navigate(-historyDelta);
    } else {
      navigate('/archive', { replace: true });
    }
  };

  const isEditingMode = () => {
    return location.search.includes('editing=true');
  };

  const isRecordingMode = () => {
    return location.search.includes('recording=true');
  };

  const isEditOrRecordingMode = () => {
    return isEditingMode() || isRecordingMode();
  };

  return {
    getBasePath,
    goBackFromEditing,
    goBackFromRecording,
    goBackAfterComplete,
    isEditingMode,
    isRecordingMode,
    isEditOrRecordingMode,
    isRecordablePage,
    location
  };
};

export default useNavigationHistory;
