import { get, post, patch, del } from "./example";

// 클럽 생성
export const createClub = async (clubData) => {
  return await post("/clubs", clubData);
};

// 클럽 멤버 목록 조회
export const getClubMembers = async (clubId) => {
  return await get(`/clubs/${clubId}/members`);
};

// 클럽 가입
export const joinClub = async (clubId) => {
  return await post(`/clubs/${clubId}/members`);
};

// 클럽 상세 조회
export const getClubDetail = async (clubId) => {
  return await get(`/clubs/${clubId}`);
};

// 클럽 삭제
export const deleteClub = async (clubId) => {
  return await del(`/clubs/${clubId}`);
};

// 클럽 정보 수정
export const updateClub = async (clubId, clubData) => {
  return await patch(`/clubs/${clubId}`, clubData);
};

// 클럽 내 게시글 목록 조회
export const getClubArchives = async (clubId) => {
  return await get(`/clubs/${clubId}/archives`);
};

// 클럽 검색
export const searchClubs = async ({ query = "", sort = "latest", page = 0, size = 20 }) => {
  const params = new URLSearchParams();
  
  // keyword 파라미터 (필수) - 빈 문자열이라도 전송해야 함
  params.append('keyword', query.trim());
  
  // status 파라미터 (선택사항, 기본값: ACTIVE)
  params.append('status', 'ACTIVE');
  
  // pageable 객체를 JSON으로 전송
  const pageable = {
    page: page,
    size: size,
    sort: [] // 빈 배열로 설정
  };
  
  params.append('pageable', JSON.stringify(pageable));
  
  return await get(`/clubs/search?${params.toString()}`);
};

// 내가 가입된 클럽 목록 조회
export const getJoinedClubs = async (sort = "latest") => {
  return await get(`/clubs/joined?sort=${sort}`);
};

// 클럽 멤버 강퇴
export const kickClubMember = async (clubId, memberId) => {
  return await del(`/clubs/${clubId}/members/${memberId}`);
};

// 클럽 멤버 탈퇴
export const leaveClub = async (clubId) => {
  return await del(`/clubs/${clubId}/members/me`);
};

// 클럽 정렬 조회
export const getSortedClubs = async (clubStatus = null, sort = "latest") => {
  const params = new URLSearchParams({ sort });
  
  // clubStatus가 null이 아니면 파라미터에 추가
  if (clubStatus !== null) {
    params.append("clubStatus", clubStatus);
  }
  
  return await get(`/clubs/joined?${params.toString()}`);
};

// 최신 북클럽 목록 조회 (둘러보기용)
export const getNewClubs = async (page = 0, size = 20, orderBy = "latest") => {
  const params = new URLSearchParams();
  
  // orderBy 파라미터 (선택사항)
  if (orderBy) {
    params.append('orderBy', orderBy);
  }
  
  // pageable 객체를 JSON으로 전송
  const pageable = {
    page: page,
    size: size,
    sort: [] // 빈 배열로 설정
  };
  
  params.append('pageable', JSON.stringify(pageable));
  
  return await get(`/clubs/new?${params.toString()}`);
};
